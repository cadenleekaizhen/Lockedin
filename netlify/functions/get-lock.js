// get-lock.js
exports.handler = async () => {
  const username = process.env.AIO_USERNAME;
  const aioKey   = process.env.AIO_KEY;
  const feed     = lock;

  if (!username || !aioKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing credentials" }) };
  }

  const url = `https://io.adafruit.com/api/v2/${encodeURIComponent(username)}/feeds/${encodeURIComponent(feed)}/data/last`;

  try {
    const res = await fetch(url, { headers: { "X-AIO-Key": aioKey } });
    const json = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(json),
      headers: { "Content-Type": "application/json" }
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
