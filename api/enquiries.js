const { createHmac, randomUUID } = require('node:crypto');
const { isIP } = require('node:net');
const { redis } = require('../server/redis');
const { sheetsRequest, SheetsError } = require('../server/sheets');

const HEADERS = [
  'timestamp', 'lead_id', 'name', 'phone', 'email', 'business_name',
  'service', 'message', 'source_page', 'status',
];
const SERVICES = new Set([
  'Social Media Marketing', 'Meta Ads', 'Video & Reels Production', 'Creative Design',
  'Company Website Development', 'Not sure yet',
]);
const RATE_WINDOW = 600;
const DEDUP_SECONDS = 86400;
const RATE_SCRIPT = `
  local count = redis.call('INCR', KEYS[1])
  if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
  return count
`;

function parseEnquiry(body) {
  let data;
  try {
    const json = typeof body === 'string' ? body : JSON.stringify(body);
    if (!json || Buffer.byteLength(json) > 8192) return null;
    data = JSON.parse(json);
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object' || data.website !== '') return null;
  const fields = { name: 100, phone: 25, email: 254, business: 100, service: 100, message: 1000 };
  const result = {};
  for (const [field, max] of Object.entries(fields)) {
    if (typeof data[field] !== 'string') return null;
    const value = data[field].trim();
    if (!value || value.length > max) return null;
    result[field] = value;
  }
  const digits = result.phone.replace(/\D/g, '');
  if (!/^\+?[\d ().-]+$/.test(result.phone) || digits.length < 7 || digits.length > 15
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)
      || !SERVICES.has(result.service)) return null;

  return result;
}

function fingerprint(value) {
  return createHmac('sha256', process.env.UPSTASH_REDIS_REST_TOKEN).update(value).digest('hex');
}

async function confirm(key, leadId) {
  try {
    await redis('SET', key, `saved:${leadId}`, 'EX', DEDUP_SECONDS);
  } catch {
    console.error('Enquiry confirmation cache unavailable');
  }
}

async function saveEnquiry(data, key, sheet) {
  const leadId = randomUUID();
  if (!await redis('SET', key, leadId, 'NX', 'EX', DEDUP_SECONDS)) {
    const existing = await redis('GET', key);
    if (existing?.startsWith('saved:')) return 200;
    if (existing) {
      const { values = [] } = await sheetsRequest(sheet, 'Enquiries!B2:B');
      if (values.some(([id]) => id === existing)) {
        await confirm(key, existing);
        return 200;
      }
    }
    return 409;
  }

  let dispatched = false;
  try {
    const { values: [header = []] = [] } = await sheetsRequest(sheet, 'Enquiries!A1:J1');
    if (!HEADERS.every((column, index) => header[index] === column)) {
      throw new Error('Invalid Enquiries headers');
    }
    const { updates } = await sheetsRequest(sheet, 'Enquiries!A:J', {
      suffix: ':append',
      query: '?valueInputOption=RAW&insertDataOption=INSERT_ROWS',
      write: true,
      onDispatch: () => { dispatched = true; },
      values: [[new Date().toISOString(), leadId, data.name, data.phone, data.email,
        data.business, data.service, data.message, '/', 'New']],
    });
    if (updates?.updatedRows !== 1) throw new Error('Enquiry append unconfirmed');
  } catch (error) {
    // An ambiguous append may have succeeded. Preserve its ID for reconciliation.
    if (!dispatched || (error instanceof SheetsError && [400, 401, 403, 404, 429].includes(error.status))) {
      await redis('DEL', key);
    }
    throw error;
  }

  await confirm(key, leadId);
  return 201;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const origin = req.headers.origin;
  const deployed = process.env.VERCEL === '1' && process.env.VERCEL_ENV !== 'development';
  const protocol = deployed ? 'https' : 'http';
  if (req.headers['sec-fetch-site'] === 'cross-site'
      || (origin && origin !== `${protocol}://${req.headers.host}`)) {
    return res.status(403).json({ error: 'Invalid request origin.' });
  }
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] ?? '')) {
    return res.status(415).json({ error: 'JSON is required.' });
  }
  if (Number(req.headers['content-length']) > 8192) {
    return res.status(413).json({ error: 'Enquiry is too large.' });
  }

  try {
    const ip = deployed
      ? req.headers['x-vercel-forwarded-for']
      : req.socket?.remoteAddress;
    if (typeof ip !== 'string' || !isIP(ip)) throw new Error('Client IP unavailable');
    const sheet = process.env.GOOGLE_ENQUIRY_SHEET_ID;
    const prefix = `gms:enquiry:${sheet}`;
    const count = await redis('EVAL', RATE_SCRIPT, 1, `${prefix}:rate:${fingerprint(ip)}`, RATE_WINDOW);
    if (count > 5) {
      res.setHeader('Retry-After', String(RATE_WINDOW));
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
    }

    const data = parseEnquiry(req.body);
    if (!data) return res.status(400).json({ error: 'Please check all enquiry fields.' });
    const normalized = { ...data, email: data.email.toLowerCase(), phone: data.phone.replace(/\D/g, '') };
    const key = `${prefix}:duplicate:${fingerprint(JSON.stringify(normalized))}`;
    const status = await saveEnquiry(data, key, sheet);
    if (status === 409) {
      return res.status(409).json({ error: 'Your previous attempt is still unconfirmed. Please try again shortly.' });
    }
    return res.status(status).json({ success: true });
  } catch {
    console.error('Enquiry submission could not be confirmed');
    return res.status(503).json({ error: 'We could not confirm your enquiry. Please try again later.' });
  }
};
