const { getBlogs, slugPattern } = require('../server/blogs');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const slug = new URL(req.url, 'http://localhost').searchParams.get('slug');
  if (slug !== null && (slug.length > 150 || !slugPattern.test(slug))) {
    return res.status(400).json({ error: 'Invalid article slug.' });
  }

  try {
    const posts = await getBlogs();
    const article = slug === null ? null : posts.find(post => post.slug === slug);
    if (slug !== null && !article) return res.status(404).json({ error: 'Article not found.' });
    res.setHeader('Vercel-CDN-Cache-Control', 's-maxage=30');
    return res.status(200).json(article ?? posts);
  } catch {
    console.error('Published articles could not be loaded');
    return res.status(503).json({ error: 'Articles are temporarily unavailable.' });
  }
};
