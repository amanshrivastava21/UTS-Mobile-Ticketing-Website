
let userId = document.querySelector("#userId");
let password = document.querySelector("#password");
let captcha = document.querySelector("#captcha");
let loginBtn = document.querySelector(".login-btn");

loginBtn.addEventListener("click", (e) => {
  e.preventDefault(); 

  if (userIdValidation(userId) && passwordValidation(password)) {
    alert("Successfully logged in!");
  }
});

// User ID validation 
const userIdValidation = (input) => {
  const value = input.value.trim();
  const isValidPhone =
    /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/;

  if (value.length < 2) {
    alert("User ID must be at least 2 characters long.");
    return false;
  } else if (!isValidPhone.test(value)) {
    alert("Invalid User ID (Please enter a valid Indian mobile number).");
    return false;
  }
  return true;
};

// Password validation
const passwordValidation = (input) => {
  const value = input.value.trim();
  const isValidPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/;

  if (value.length < 8) {
    alert("Password must be at least 8 characters long.");
    return false;
  } else if (!isValidPassword.test(value)) {
    alert(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
    return false;
  }
  return true;
};

//  if (captchaVal !== captchaText.textContent) {
//     alert("Incorrect captcha! Please try again.");
//     generateCaptcha();
//     captchaInput.focus();
//     return false;
//   }

//   generateBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   validateForm();
// });

// function generateCaptcha() {
//   const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
//   let captcha = "";
//   for (let i = 0; i < 5; i++) {
//     captcha += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   captchaText.textContent = captcha;
// }
// generateCaptcha(); // show initial captcha

// refreshBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   generateCaptcha();
// });