//
//   Navigation
//

// add classes for mobile navigation toggling
var CSbody = document.querySelector("body");
const CSnavbarMenu = document.querySelector("#cs-navigation");
const CShamburgerMenu = document.querySelector("#cs-navigation .cs-toggle");

CShamburgerMenu.addEventListener("click", function () {
  CShamburgerMenu.classList.toggle("cs-active");
  CSnavbarMenu.classList.toggle("cs-active");
  CSbody.classList.toggle("cs-open");
  // run the function to check the aria-expanded value
  ariaExpanded();
});

// checks the value of aria expanded on the cs-ul and changes it accordingly whether it is expanded or not
function ariaExpanded() {
  const csUL = document.querySelector("#cs-expanded");
  const csExpanded = csUL.getAttribute("aria-expanded");

  if (csExpanded === "false") {
    csUL.setAttribute("aria-expanded", "true");
  } else {
    csUL.setAttribute("aria-expanded", "false");
  }
}

// mobile nav toggle code
const dropDowns = Array.from(
  document.querySelectorAll("#cs-navigation .cs-dropdown")
);
for (const item of dropDowns) {
  const onClick = () => {
    item.classList.toggle("cs-active");
  };
  item.addEventListener("click", onClick);
}

//
//          LOCK
//
const username = "maxlj002";
const aioKey = "";
const feedLock = "lock";

const toggle = document.getElementById("lockToggle");
const statusText = document.getElementById("statusText");
const POLL_INTERVAL = 1000; // fetch every 3 seconds

let lastLockStatus = null; // store last value to avoid unnecessary UI updates

// ✅ Get the latest value from Adafruit IO
async function getLockState() {
  try {
    const res = await fetch(
      `https://io.adafruit.com/api/v2/${username}/feeds/${feedLock}/data/last`,
      {
        headers: { "X-AIO-Key": aioKey },
      }
    );
    const data = await res.json();
    const value = data.value.toUpperCase();
    // Only update UI if value has changed
    if (value !== lastLockStatus) {
      lastLockStatus = value;
      updateUI(value);
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    statusText.textContent = "Error loading status";
    statusText.style.color = "#999";
  }
}

// ✅ Send a new lock/unlock command
async function sendLockState(value) {
  try {
    await fetch(
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
    updateUI(value);
  } catch (err) {
    console.error("Error sending data:", err);
  }
}

// ✅ Update UI when state changes
function updateUI(value) {
  statusText.classList.add("fade");
  setTimeout(() => statusText.classList.remove("fade"), 500);

  if (value === "UNLOCK") {
    toggle.checked = false;
    statusText.textContent = "Unlocked";
    statusText.style.color = "#4CAF50";
  } else {
    toggle.checked = true;
    statusText.textContent = "Locked";
    statusText.style.color = "#F44336";
  }
}

// ✅ Listen for toggle changes
toggle.addEventListener("change", () => {
  const value = toggle.checked ? "LOCK" : "UNLOCK";
  sendLockState(value);
});

// ✅ Initialize when page loads
getLockState();
setInterval(getLockState, POLL_INTERVAL);

//
//    SPEED
//
const feedSpeed = "speed";

const speedElement = document.getElementById("speed");
let lastSpeed = null;

async function getSpeed() {
  try {
    const res = await fetch(
      `https://io.adafruit.com/api/v2/${username}/feeds/${feedSpeed}/data/last`,
      {
        headers: { "X-AIO-Key": aioKey },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const value = parseFloat(data.value);

    if (value !== lastSpeed) {
      lastSpeed = value;
      speedElement.textContent = `${value.toFixed(1)} km/h`;
    }
  } catch (err) {
    console.error("Error fetching speed:", err);
    speedElement.textContent = "Error";
  }
}

getSpeed();
setInterval(getSpeed, POLL_INTERVAL);

//
//    DISTANCE
//
const feedDistance = "distance";

const distanceElement = document.getElementById("distance");
let lastDistance = null;

async function getDistance() {
  try {
    const res = await fetch(
      `https://io.adafruit.com/api/v2/${username}/feeds/${feedDistance}/data/last`,
      {
        headers: { "X-AIO-Key": aioKey },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const value = parseFloat(data.value);

    if (value !== lastDistance) {
      lastDistance = value;
      distanceElement.textContent = `${value.toFixed(1)} km`;
    }
  } catch (err) {
    console.error("Error fetching distance:", err);
    distanceElement.textContent = "Error";
  }
}

getDistance();
setInterval(getDistance, POLL_INTERVAL);

//
//    Alarm
//
const feedAlarm = "alarm";

const alarmBtn = document.getElementById("alarmBtn");
const alarmHistoryList = document.getElementById("alarmHistory");

// Ring alarm for 5 seconds
async function ringAlarm() {
  try {
    await sendAlarm(1); // Turn ON
    setTimeout(() => sendAlarm(0), 5000); // Turn OFF after 5 seconds
  } catch (err) {
    console.error("Error ringing alarm:", err);
  }
}

// Send alarm value to Adafruit IO
async function sendAlarm(value) {
  try {
    await fetch(
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
  } catch (err) {
    console.error("Error sending alarm:", err);
  }
}

// Fetch last 5 alarm ON events
async function fetchAlarmHistory() {
  try {
    const res = await fetch(
      `https://io.adafruit.com/api/v2/${username}/feeds/${feedAlarm}/data?limit=20`,
      {
        headers: { "X-AIO-Key": aioKey },
      }
    );
    const data = await res.json();

    alarmHistoryList.innerHTML = "";

    if (!Array.isArray(data)) {
      console.error("Unexpected response:", data);
      alarmHistoryList.innerHTML = "<li>No data available</li>";
      return;
    }

    // Only show ON events
    const onEvents = data.filter((item) => item.value === "1").slice(0, 5);

    if (onEvents.length === 0) {
      alarmHistoryList.innerHTML = "<li>No alarm events</li>";
      return;
    }

    onEvents.forEach((item) => {
      const li = document.createElement("li");
      const date = new Date(item.created_at);
      li.textContent = `${date.toLocaleString()}`;
      alarmHistoryList.appendChild(li);
    });
  } catch (err) {
    console.error("Error fetching alarm history:", err);
    alarmHistoryList.innerHTML = "<li>Error loading history</li>";
  }
}

// Event listener
alarmBtn.addEventListener("click", ringAlarm);

// Initialize
fetchAlarmHistory();

// Auto-refresh every 3 seconds
setInterval(fetchAlarmHistory, 3000);

//
//    Map
//

// ===== CONFIGURATION =====
const feedMap = "gps-location";
// =========================
// ===== VARIABLES =====
let map, marker;
let currentLocation = null;
let currentStartTime = null;
let pastLocations = [];

// ===== INIT MAP =====
function initMap(lat, lon) {
  if (!map) {
    map = L.map("map").setView([lat, lon], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);
  }

  if (!marker) {
    marker = L.marker([lat, lon]).addTo(map);
  } else {
    marker.setLatLng([lat, lon]);
  }

  map.setView([lat, lon], 15);
}

// ===== REVERSE GEOCODE =====
async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    return data.display_name || "Unknown location";
  } catch {
    return "Unknown location";
  }
}

// ===== FORMAT TIME =====
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ===== UPDATE PAST LOCATIONS =====
function updatePastLocations() {
  const list = document.getElementById("past-locations");
  if (!list) return; // safety check

  list.innerHTML = "";
  // show last 5
  pastLocations
    .slice(-5)
    .reverse()
    .forEach((loc) => {
      const li = document.createElement("li");
      li.textContent = `${formatTime(loc.start)} – ${formatTime(loc.end)} (${
        loc.duration
      } min) at ${loc.address}`;
      list.appendChild(li);
    });
}

// ===== UPDATE "SINCE ..." =====
function updateTimeAtLocation() {
  if (currentStartTime) {
    document.getElementById(
      "time-at-location"
    ).textContent = `Since ${formatTime(currentStartTime)}`;
  }
}

// ===== HANDLE NEW LOCATION =====
let lastLat = null;
let lastLon = null;

async function handleNewLocation(lat, lon, createdAt) {
  const createdDate = new Date(createdAt);

  // Check if this is the first location
  if (currentLocation === null) {
    currentLocation = { lat, lon };
    currentStartTime = createdDate;
    const address = await reverseGeocode(lat, lon);
    document.getElementById("address").textContent = address;
    initMap(lat, lon);
    return;
  }

  // Compare coordinates with last recorded location
  if (lat !== currentLocation.lat || lon !== currentLocation.lon) {
    // Push previous location to pastLocations
    const endTime = createdDate;
    const duration = Math.round((endTime - currentStartTime) / 60000);
    const prevAddress = await reverseGeocode(
      currentLocation.lat,
      currentLocation.lon
    );

    pastLocations.push({
      address: prevAddress,
      start: currentStartTime,
      end: endTime,
      duration,
    });

    // Keep only last 5
    if (pastLocations.length > 5) pastLocations.shift();

    updatePastLocations();

    // Update current location
    currentLocation = { lat, lon };
    currentStartTime = createdDate;

    const address = await reverseGeocode(lat, lon);
    document.getElementById("address").textContent = address;

    // Update map
    initMap(lat, lon);
  }

  // Always update "Since ..."
  updateTimeAtLocation();
}

// ===== FETCH LOCATION FROM ADAFRUIT =====
async function fetchLocationFromAdafruit() {
  try {
    const res = await fetch(`https://io.adafruit.com/api/v2/${username}/feeds/${feedMap}/data/last`, { headers: { "X-AIO-Key": aioKey } });
    const data = await res.json();

    const lat = parseFloat(data.location?.lat);
    const lon = parseFloat(data.location?.lon);

    if (!isNaN(lat) && !isNaN(lon)) {
      handleNewLocation(lat, lon, data.created_at);
    } else {
      document.getElementById("address").textContent = "⚠️ Invalid GPS data";
    }
  } catch (err) {
    console.error("Error fetching from Adafruit:", err);
    document.getElementById("address").textContent =
      "❌ Error fetching location";
  }
}

// ===== AUTO REFRESH =====
setInterval(fetchLocationFromAdafruit, POLL_INTERVAL);
setInterval(updateTimeAtLocation, 60000);

// ===== START =====
fetchLocationFromAdafruit();
