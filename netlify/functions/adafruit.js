// netlify/functions/adafruit.js
export async function handler(event) {
  const { action, value } = JSON.parse(event.body || "{}");

  
  const username = "maxlj002";
  const feedLock = "lock";
  const feedSpeed = "speed";
  const feedDistance = "distance";
  const feedAlarm = "alarm";
  const feedMap = "gps-location";

  const aioKey = process.env.ADAFRUIT_IO_KEY;
  
  // LOCK
  const resLock = await fetch(
      `https://io.adafruit.com/api/v2/${username}/feeds/${feedLock}/data/last`,
      {
        headers: { "X-AIO-Key": aioKey },
      }
    );
  const dataLock = await resLock.json();
  const valueLock = dataLock.value.toUpperCase();

  const sendLock = await fetch(
      `https://io.adafruit.com/api/v2/${username}/feeds/${feedLock}/data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AIO-Key": aioKey,
        },
        body: JSON.stringify({ value }),
      }
    );

  // Speed
  const resSpeed = await fetch(
      `https://io.adafruit.com/api/v2/${username}/feeds/${feedSpeed}/data/last`,
      {
        headers: { "X-AIO-Key": aioKey },
      }
    );
  if (!resSpeed.ok) throw new Error(`HTTP ${resSpeed.status}`);
  const dataSpeed = await resSpeed.json();
  const valueSpeed = parseFloat(dataSpeed.value);

  // Distance
  const resDistance = await fetch(
      `https://io.adafruit.com/api/v2/${username}/feeds/${feedDistance}/data/last`,
      {
        headers: { "X-AIO-Key": aioKey },
      }
    );
    if (!resDistance.ok) throw new Error(`HTTP ${resDistance.status}`);
    const dataDistance = await resDistance.json();
    const valueDistance = parseFloat(dataDistance.value);

  // Alarm
  const sendAlarm = await fetch(
      `https://io.adafruit.com/api/v2/${username}/feeds/${feedAlarm}/data`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AIO-Key": aioKey,
        },
        body: JSON.stringify({ value }),
      }
    );

  const resAlarm = await fetch(
      `https://io.adafruit.com/api/v2/${username}/feeds/${feedAlarm}/data?limit=20`,
      {
        headers: { "X-AIO-Key": aioKey },
      }
    );
    const dataAlarm = await resAlarm.json();

  // Map
  const resMap = await fetch(
    `https://io.adafruit.com/api/v2/${username}/feeds/${feedMap}/data/last`,
    {
      headers: { "X-AIO-Key": aioKey }
    }
  );
  const dataMap = await resMap.json();

return {
  statusCode: 200,
  body: JSON.stringify({
    lock: valueLock,
    speed: valueSpeed,
    distance: valueDistance,
    alarm: dataAlarm,
    map: dataMap,
  }),
};
