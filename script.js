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
//   Login Form
//
// Hardcoded login credentials
const correctUsername = "Admin123";
const correctPassword = "Password123";

const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // prevent form from refreshing page

  const enteredUsername = usernameInput.value;
  const enteredPassword = passwordInput.value;

  // Check credentials
  if (
    enteredUsername === correctUsername &&
    enteredPassword === correctPassword
  ) {
    // ✅ Redirect to another page if login is correct
    window.location.href = "dashboard.html";
  } else {
    // ❌ Show error and red border if incorrect
    errorMsg.textContent = "Incorrect username or password.";
  }
});

// SW

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("./service_worker.js")
        .then(function() {
          console.log("Service Worker registered");
        })
        .catch(function(err) {
          console.log("SW registration failed:", err);
        });
    });
  }

// Install
let deferredPrompt;
const installButton = document.getElementById("installButton");

// Listen for the beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the default mini-info bar from appearing
  e.preventDefault();
  deferredPrompt = e;
  // Show your custom install button
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  // Hide the button
  installButton.hidden = true;
  // Show the browser's install prompt
  deferredPrompt.prompt();
  // Wait for user choice
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to the install prompt: ${outcome}`);
  deferredPrompt = null;
});

window.addEventListener("appinstalled", () => {
  console.log("PWA installed!");
  document.getElementById("installButton").hidden = true;
});
