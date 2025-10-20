// Hardcoded credentials
const correctUsername = "Admin123";
const correctPassword = "Password123";

const form = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("error-msg");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form from submitting

  const enteredUsername = usernameInput.value.trim();
  const enteredPassword = passwordInput.value.trim();

  if (
    enteredUsername === correctUsername &&
    enteredPassword === correctPassword
  ) {
    // ✅ Redirect if correct
    window.location.href = "dashboard.html";
  } else {
    // ❌ Show error and red border if incorrect
    errorMsg.textContent = "Incorrect username or password.";
    usernameInput.classList.add("invalid");
    passwordInput.classList.add("invalid");
  }
});

// Optional: Remove red border when user types again
usernameInput.addEventListener("input", () => {
  usernameInput.classList.remove("invalid");
  errorMsg.textContent = "";
});

passwordInput.addEventListener("input", () => {
  passwordInput.classList.remove("invalid");
  errorMsg.textContent = "";
});
