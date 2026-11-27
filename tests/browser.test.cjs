const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { extname, resolve, sep } = require('node:path');
const { test } = require('node:test');
const { chromium } = require('playwright');

const root = resolve('dist/growth-marketing-angular/browser');
const article = {
  id: '1', slug: 'launch-ideas', title: 'Launch Ideas', excerpt: 'Ideas for your next launch.',
  content: 'A section about reels.\n\n<img src=x onerror=alert(1)>',
  category: 'Marketing', color: 'orange', icon: 'chart', author: 'Jane Doe',
  publishedAt: '2026-11-23T00:00:00.000Z', featured: true,
  coverImageUrl: '/assets/images/growth-logo.png',
  metaTitle: 'Launch Ideas SEO title', metaDescription: 'Launch Ideas SEO description',
};
const secondArticle = { ...article, id: '2', slug: 'design-ideas', title: 'Design Ideas',
  category: 'Creative', content: 'Design article.', coverImageUrl: '' };
const mime = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
};
const spaRoutes = new Set(['/', '/about', '/services', '/blog']);

test('production Angular bundle routes and renders blog and enquiries on mobile, tablet and desktop', async t => {
  let submissions = 0;
  const server = createServer(async (req, res) => {
    const { pathname, searchParams } = new URL(req.url, 'http://localhost');
    if (pathname === '/api/blogs') {
      const slug = searchParams.get('slug');
      const post = [article, secondArticle].find(item => item.slug === slug);
      const status = slug && !post ? 404 : 200;
      res.writeHead(status, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(slug ? post ?? {} : [article, secondArticle]));
    }
    if (pathname === '/api/enquiries' && req.method === 'POST') {
      submissions++;
      req.resume();
      res.writeHead(submissions === 1 ? 503 : 201, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(submissions === 1 ? {} : { success: true }));
    }

    const file = resolve(root, spaRoutes.has(pathname) ? 'index.html' : '.' + pathname);
    try {
      if (!file.startsWith(root + sep)) throw new Error('Invalid fixture path');
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' });
      res.end(bytes);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
  t.after(() => new Promise(resolveClose => server.close(resolveClose)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  try {
    for (const [width, height] of [[390, 844], [768, 1024], [1440, 900]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      await page.goto(base + '/blog');
      const cards = page.locator('#blog-grid .blog-card');
      await cards.nth(1).waitFor();
      assert.equal(await cards.count(), 2);
      const cover = cards.first().locator('img');
      await cover.scrollIntoViewIfNeeded();
      await cover.evaluate(img => img.decode());
      const coverBox = await cover.boundingBox();
      assert.ok(coverBox.width > 0 && coverBox.x + coverBox.width <= width + 1);

      await page.getByRole('button', { name: 'Creative', exact: true }).click();
      await cards.nth(1).waitFor({ state: 'hidden' });
      assert.match(await cards.first().innerText(), /Design Ideas/);
      await page.getByRole('button', { name: 'All', exact: true }).click();
      await cards.nth(1).waitFor();
      await page.getByRole('searchbox').fill('reels');
      await cards.nth(1).waitFor({ state: 'hidden' });
      await cards.first().click();
      const reader = page.getByRole('dialog', { name: 'Launch Ideas' });
      await reader.waitFor();
      assert.equal(new URL(page.url()).searchParams.get('article'), article.slug);
      assert.equal(await page.title(), article.metaTitle);
      assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), article.metaDescription);
      assert.match(await reader.innerText(), /<img src=x onerror=alert\(1\)>/);
      assert.equal(await reader.locator('.article-content img').count(), 0);
      const readerBox = await reader.locator('.article-dialog-modal').boundingBox();
      assert.ok(readerBox.width <= width && readerBox.height <= height);
      await page.reload();
      await reader.waitFor();
      await reader.getByRole('button', { name: 'Close article' }).click();
      await reader.waitFor({ state: 'hidden' });
      assert.equal(new URL(page.url()).searchParams.get('article'), null);
      assert.equal(await page.title(), 'Blog | Growth Marketing Agency');

      if (width === 1440) {
        for (const slug of ['about', 'services']) {
          await page.goto(base + '/' + slug);
          await page.locator('app-' + slug + ' h1').waitFor();
        }
      }

      await page.goto(base + '/#contact');
      const form = page.locator('#inquiry-form');
      await form.waitFor();
      const formBox = await form.boundingBox();
      assert.ok(formBox.x >= 0 && formBox.x + formBox.width <= width + 1);
      assert.equal(await form.locator('[formcontrolname="website"]').isVisible(), false);
      assert.equal(await form.getByRole('option', { name: 'Company Website Development' }).count(), 1);
      if (width === 390) {
        const submit = form.getByRole('button', { name: 'Send My Enquiry' });
        await submit.click();
        assert.equal(submissions, 0);
        await form.getByLabel('Your name').fill('Jane Doe');
        await form.getByLabel('Business name').fill('Acme');
        await form.getByLabel('Phone number').fill('+91 98765 43210');
        await form.getByLabel('Email address').fill('jane@example.com');
        await form.getByLabel('What are you looking for?').selectOption('Company Website Development');
        await form.getByLabel('Tell us a little more').fill('Build a website');
        await submit.click();
        await page.getByText('We could not confirm your enquiry. Please try again.').waitFor();
        assert.equal(await form.getByLabel('Your name').inputValue(), 'Jane Doe');
        await submit.click();
        await page.getByText('Thanks! Your enquiry has been sent.').waitFor();
        assert.equal(await form.getByLabel('Your name').inputValue(), '');
        assert.equal(submissions, 2);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
});
