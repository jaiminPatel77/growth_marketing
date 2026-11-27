const { sheetsRequest } = require('./sheets');

const CACHE_MS = 60_000;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const columns = [
  'id', 'slug', 'title', 'excerpt', 'content', 'category', 'cover_image_url',
  'author', 'published_at', 'status', 'featured', 'meta_title', 'meta_description',
];
let cached;
let pending;

function parseBlogs(values) {
  const [header = [], ...rows] = values;
  const positions = columns.map(column => header.indexOf(column));
  if (positions.some(index => index < 0)) throw new Error('Invalid Blogs headers');

  const posts = rows.map(row => {
    const [id, slug, title, excerpt, content, category, cover, author, publishedAt,
      status, featured, metaTitle, metaDescription] = positions.map(index => String(row[index] ?? '').trim());
    const date = new Date(publishedAt);
    if (status !== 'PUBLISHED' || !id || !title || !content || slug.length > 150 || !slugPattern.test(slug)
        || !/^\d{4}-\d{2}-\d{2}(?:$|T)/.test(publishedAt) || !Number.isFinite(+date)) return null;

    const appearance = {
      Marketing: ['orange', 'chart'],
      'Social Media': ['teal', 'users'],
      Creative: ['coral', 'design'],
    };
    const [color, icon] = Object.hasOwn(appearance, category) ? appearance[category] : ['gold', 'spark'];
    let coverImageUrl = '';
    try {
      const url = new URL(cover);
      if (url.protocol === 'https:' && !url.username && !url.password) coverImageUrl = url.href;
    } catch {
      // Use the existing category thumbnail when there is no valid HTTPS image.
    }
    return {
      id, slug, title, excerpt, content, category: category || 'Uncategorized',
      coverImageUrl, author, publishedAt: date.toISOString(), featured: /^(true|yes|1)$/i.test(featured),
      metaTitle, metaDescription, color, icon,
    };
  }).filter(Boolean).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const slugs = new Set();
  return posts.filter(({ slug }) => {
    if (slugs.has(slug)) return false;
    slugs.add(slug);
    return true;
  });
}

async function getBlogs() {
  if (cached && cached.expires > Date.now()) return cached.posts;
  pending ??= sheetsRequest(process.env.GOOGLE_BLOG_SHEET_ID, 'Blogs!A:M', {
    query: '?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING',
  }).then(({ values = [] }) => {
    const posts = parseBlogs(values);
    cached = { posts, expires: Date.now() + CACHE_MS };
    return posts;
  }).finally(() => { pending = undefined; });
  return pending;
}

module.exports = { getBlogs, parseBlogs, slugPattern };
