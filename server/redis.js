async function redis(...command) {
  const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } = process.env;
  if (!url?.startsWith('https://') || !token) throw new Error('Redis configuration missing');
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error('Redis request failed');
  const { result, error } = await response.json();
  if (error) throw new Error('Redis command failed');
  return result;
}

module.exports = { redis };
