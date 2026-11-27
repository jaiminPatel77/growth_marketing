const assert = require('node:assert/strict');
const { test } = require('node:test');
const { JWT } = require('google-auth-library');
const blogs = require('../api/blogs');
const enquiries = require('../api/enquiries');

const blogHeader = [
  'id', 'slug', 'title', 'excerpt', 'content', 'category', 'cover_image_url',
  'author', 'published_at', 'status', 'featured', 'meta_title', 'meta_description',
];
const enquiryHeader = [
  'timestamp', 'lead_id', 'name', 'phone', 'email', 'business_name', 'service',
  'message', 'source_page', 'status',
];

const blogRow = (slug, date, status = 'PUBLISHED') => [
  slug, slug, slug, 'Summary', '<script>Plain text only</script>', 'Marketing',
  'https://images.example/cover.jpg', 'Example Author', date, status, true,
  'Article SEO title', 'Article SEO description',
];
const enquiry = {
  website: '', name: '=1+1', phone: '+91 98765 43210', email: 'jane@example.com',
  business: 'Acme', service: 'Company Website Development', message: 'Build a website',
};

async function call(handler, req = {}) {
  const res = {
    statusCode: 200,
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
  await handler({ method: 'GET', url: '/api/blogs', ...req }, res);
  return res;
}

function mockServices(t) {
  const settings = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: 'test@example.invalid',
    GOOGLE_PRIVATE_KEY: 'test\\nkey',
    GOOGLE_BLOG_SHEET_ID: 'blog-test',
    GOOGLE_ENQUIRY_SHEET_ID: 'enquiry-test',
    UPSTASH_REDIS_REST_URL: 'https://redis.example.invalid',
    UPSTASH_REDIS_REST_TOKEN: 'test-token',
    VERCEL: '1',
    VERCEL_ENV: 'preview',
  };
  for (const [key, value] of Object.entries(settings)) {
    const old = process.env[key];
    t.after(() => {
      if (old === undefined) delete process.env[key];
      else process.env[key] = old;
    });
    process.env[key] = value;
  }

  const state = { blogRows: [blogHeader], reads: 0, rows: [], redis: new Map(), appendFailure: 0 };
  t.mock.method(JWT.prototype, 'getAccessToken', function () {
    assert.equal(this.email, settings.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    assert.equal(this.key, 'test\nkey');
    return { token: this.scopes[0] };
  });
  t.mock.method(console, 'error', () => {});
  t.mock.method(global, 'fetch', async (url, options) => {
    if (url === settings.UPSTASH_REDIS_REST_URL) {
      assert.equal(options.headers.Authorization, 'Bearer test-token');
      const [command, ...args] = JSON.parse(options.body);
      const [key, value] = args;
      const store = state.redis;
      if (command === 'EVAL') {
        const rateKey = args[2];
        const count = (store.get(rateKey) ?? 0) + 1;
        store.set(rateKey, count);
        return Response.json({ result: count });
      }
      if (command === 'SET') {
        if (args.includes('NX') && store.has(key)) return Response.json({ result: null });
        store.set(key, value);
        return Response.json({ result: 'OK' });
      }
      if (command === 'GET') return Response.json({ result: store.get(key) ?? null });
      if (command === 'DEL') return Response.json({ result: Number(store.delete(key)) });
      assert.fail(`Unexpected Redis command ${command}`);
    }

    const request = new URL(url);
    assert.equal(request.hostname, 'sheets.googleapis.com');
    const scope = 'Bearer https://www.googleapis.com/auth/spreadsheets';
    const range = decodeURIComponent(request.pathname.split('/').at(-1));
    if (options.method === 'POST') {
      assert.equal(options.headers.Authorization, scope);
      assert.equal(range, 'Enquiries!A:J:append');
      assert.equal(request.searchParams.get('valueInputOption'), 'RAW');
      assert.equal(request.searchParams.get('insertDataOption'), 'INSERT_ROWS');
      if (state.appendFailure === 403) return Response.json({}, { status: 403 });
      state.rows.push(JSON.parse(options.body).values[0]);
      if (state.appendFailure === 503) return Response.json({}, { status: 503 });
      return Response.json({ updates: { updatedRows: 1 } });
    }
    assert.equal(options.headers.Authorization, scope + '.readonly');
    if (range === 'Blogs!A:M') {
      state.reads++;
      return state.blogFailure ? Response.json({}, { status: 503 }) : Response.json({ values: state.blogRows });
    }
    if (range === 'Enquiries!A1:J1') return Response.json({ values: [enquiryHeader] });
    if (range === 'Enquiries!B2:B') return Response.json({ values: state.rows.map(row => [row[1]]) });
    assert.fail(`Unexpected Sheets range ${range}`);
  });
  return state;
}

function submit(body, ip = '203.0.113.1', origin = 'https://preview.example') {
  return call(enquiries, {
    method: 'POST',
    headers: { host: 'preview.example', origin, 'x-vercel-forwarded-for': ip, 'content-type': 'application/json' },
    body,
  });
}

test('only serves published articles, sorts by date, deduplicates slugs and refreshes after the cache expires', async t => {
  const state = mockServices(t);
  let now = Date.now();
  t.mock.method(Date, 'now', () => now);
  state.blogRows.push(blogRow('older', '2026-11-20'), blogRow('newer', '2026-11-22'),
    blogRow('draft', '2026-11-23', 'DRAFT'), blogRow('newer', '2026-11-01'));
  const list = await call(blogs);
  assert.equal(list.statusCode, 200);
  assert.deepEqual(list.body.map(post => post.slug), ['newer', 'older']);
  assert.equal((await call(blogs, { url: '/api/blogs?slug=draft' })).statusCode, 404);
  const detail = await call(blogs, { url: '/api/blogs?slug=newer' });
  assert.equal(detail.body.metaTitle, 'Article SEO title');
  assert.equal(detail.body.content, '<script>Plain text only</script>');
  assert.equal(state.reads, 1);
  state.blogRows.push(blogRow('just-published', '2026-11-27'));
  assert.equal((await call(blogs)).body.length, 2);
  now += 60_001;
  assert.equal((await call(blogs)).body[0].slug, 'just-published');
  assert.equal(state.reads, 2);
  now += 60_001;
  state.blogFailure = true;
  const unavailable = await call(blogs);
  assert.equal(unavailable.statusCode, 503);
  assert.equal(unavailable.headers['Cache-Control'], 'no-store');
});

test('validates enquiries, rate limits by trusted IP and returns no lead data', async t => {
  const state = mockServices(t);
  assert.equal((await call(enquiries)).statusCode, 405);
  assert.equal((await submit(enquiry, '203.0.113.1', 'https://other.example')).statusCode, 403);
  assert.equal((await submit({ ...enquiry, website: 'spam' })).statusCode, 400);
  assert.equal((await submit({ ...enquiry, phone: '123' })).statusCode, 400);
  assert.equal(state.rows.length, 0);
  const saved = await submit(enquiry);
  const duplicate = await submit(enquiry);
  assert.equal(saved.statusCode, 201);
  assert.equal(duplicate.statusCode, 200);
  assert.deepEqual(saved.body, { success: true });
  assert.deepEqual(duplicate.body, { success: true });
  assert.equal(state.rows.length, 1);
  const [[timestamp, leadId, ...fields]] = state.rows;
  assert.equal(new Date(timestamp).toISOString(), timestamp);
  assert.match(leadId, /^[0-9a-f-]{36}$/);
  assert.deepEqual(fields, [enquiry.name, enquiry.phone, enquiry.email, enquiry.business,
    enquiry.service, enquiry.message, '/', 'New']);
  assert.equal((await submit(enquiry)).statusCode, 200);
  assert.equal((await submit(enquiry)).statusCode, 429);
});

test('retries definitive Sheets failures and reconciles an ambiguous append without writing twice', async t => {
  const state = mockServices(t);
  state.appendFailure = 403;
  assert.equal((await submit(enquiry)).statusCode, 503);
  assert.equal(state.rows.length, 0);
  state.appendFailure = 503;
  assert.equal((await submit(enquiry)).statusCode, 503);
  assert.equal(state.rows.length, 1);
  const retry = await submit(enquiry);
  assert.equal(retry.statusCode, 200);
  assert.deepEqual(retry.body, { success: true });
  assert.equal(state.rows.length, 1);
});

test('concurrent copies of the same enquiry result in one append', async t => {
  const state = mockServices(t);
  const responses = await Promise.all([submit(enquiry), submit(enquiry, '203.0.113.2')]);
  assert.equal(state.rows.length, 1);
  assert.ok(responses.some(result => result.statusCode === 201));
  assert.ok(responses.every(result => [200, 201, 409].includes(result.statusCode)));
});
