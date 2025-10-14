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

const form = document.getElementById("cs-form-242");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // prevent form from refreshing page

  const enteredUsername = usernameInput.value;
  const enteredPassword = passwordInput.value;

  // Check credentials
  if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
    // ✅ Redirect to another page if login is correct
    window.location.href = "dashboard.html";
  }// else {
    // ❌ Show error message and red border
   // errorMsg.textContent = "Incorrect username or password!";
    //usernameInput.classList.add("invalid");
    //passwordInput.classList.add("invalid");

    // Optional: remove red border when user types again
    //usernameInput.addEventListener("input", () => usernameInput.classList.remove("invalid"));
    //passwordInput.addEventListener("input", () => passwordInput.classList.remove("invalid"));
  //}
});