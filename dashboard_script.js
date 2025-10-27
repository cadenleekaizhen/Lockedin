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

const toggle = document.getElementById("lockToggle");
const statusText = document.getElementById("statusText");
const POLL_INTERVAL = 3000; // fetch every 3 seconds

let lastKnownValue = null; // store last value to avoid unnecessary UI updates

// ✅ Get the latest value from Netlify function
async function getLockState() {
  try {
    const res = await fetch('/.netlify/functions/get-lock');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const value = (data.value || "").toString().toUpperCase();

    // Only update UI if value has changed
    if (value !== lastKnownValue) {
      lastKnownValue = value;
      updateUI(value);
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    statusText.textContent = "Error loading status";
    statusText.style.color = "#999";
  }
}

// ✅ Send a new lock/unlock command via Netlify function
async function sendLockState(value) {
  try {
    const res = await fetch('/.netlify/functions/set-lock', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value })
    });
    if (!res.ok) throw new Error(await res.text());
    // Optional: re-fetch latest to confirm
    await getLockState();
  } catch (err) {
    console.error("Error sending data:", err);
    statusText.textContent = "Send failed";
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
