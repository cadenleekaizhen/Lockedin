// set-lock.js
exports.handler = async (event) => {
  const username = process.env.AIO_USERNAME;
  const aioKey   = process.env.AIO_KEY;
  const feed     = lock;

  if (!username || !aioKey) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing credentials" }) };
  }

  // parse value from JSON body
  let value;
  try {
    value = JSON.parse(event.body).value;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing or invalid 'value' in request body" }) };
  }

  const url = `https://io.adafruit.com/api/v2/${encodeURIComponent(username)}/feeds/${encodeURIComponent(feed)}/data`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AIO-Key": aioKey
      },
      body: JSON.stringify({ value: String(value) })
    });
    const text = await res.text();
    return { statusCode: res.ok ? 200 : res.status, body: text };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
