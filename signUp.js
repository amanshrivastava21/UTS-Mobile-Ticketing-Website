// === Get all input fields ===
const nameInput = document.querySelector("#name");
const numberInput = document.querySelector("#number");
const passwordInput = document.querySelector("#Password");
const confirmInput = document.querySelector("#Confirm");
const genderSelect = document.querySelectorAll(".userSelect")[0];
const dobInput = document.querySelector("#date-of-birth");
const idTypeSelect = document.querySelectorAll(".userSelect")[1];
const idCardInput = document.querySelector("#id-card");
const citySelect = document.querySelectorAll(".userSelect")[2];
const captchaInput = document.querySelector('input[placeholder="Enter Captcha"]');
const captchaText = document.querySelector(".captcha");
const refreshBtn = document.querySelector("#refresh");
const generateBtn = document.querySelector("#generate");

// === Captcha Generator ===
function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let captcha = "";
  for (let i = 0; i < 5; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaText.textContent = captcha;
}
generateCaptcha(); // show initial captcha

refreshBtn.addEventListener("click", (e) => {
  e.preventDefault();
  generateCaptcha();
});

// === Validation & Submit Function ===
async function validateForm() {
  const name = nameInput.value.trim();
  const number = numberInput.value.trim();
  const password = passwordInput.value.trim();
  const confirm = confirmInput.value.trim();
  const gender = genderSelect.value;
  const dob = dobInput.value.trim();
  const idType = idTypeSelect.value;
  const idCard = idCardInput.value.trim();
  const city = citySelect.value;
  const captchaVal = captchaInput.value.trim();

  // === Name Validation ===
  if (name.length < 2) {
    alert("Please enter a valid name (minimum 2 characters).");
    nameInput.focus();
    return false;
  }

  // === Mobile Number Validation ===
  const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{9})$/;
  if (!phoneRegex.test(number)) {
    alert("Please enter a valid 10-digit mobile number.");
    numberInput.focus();
    return false;
  }

  // === Password Validation ===
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/;
  if (!passwordRegex.test(password)) {
    alert(
      "Password must be 8–20 characters long and include uppercase, lowercase, number, and special character."
    );
    passwordInput.focus();
    return false;
  }

  // === Confirm Password Validation ===
  if (password !== confirm) {
    alert("Password and Confirm Password do not match.");
    confirmInput.focus();
    return false;
  }

  // === Gender, DOB, ID Type, City ===
  if (!gender) {
    alert("Please select your gender.");
    return false;
  }

  if (!dob) {
    alert("Please select your date of birth.");
    return false;
  }

  if (idType === "choose one") {
    alert("Please select a valid ID card type.");
    return false;
  }

  if (idCard.length < 5) {
    alert("Please enter a valid ID card number.");
    idCardInput.focus();
    return false;
  }

  if (city === "Choose one") {
    alert("Please select your city.");
    return false;
  }

  // === Captcha Validation ===
  if (captchaVal !== captchaText.textContent) {
    alert("Incorrect captcha! Please try again.");
    generateCaptcha();
    captchaInput.focus();
    return false;
  }

  // === All validations passed ===
  try {
    // Send data to backend
    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        mobile: number,
        password,
        confirmPassword: confirm,
        gender,
        dob,
        idCardType: idType,
        idCardNumber: idCard,
        city
      })
    });

    const result = await response.json();
    if (response.ok) {
      alert("✅ Registration Successful! " + result.message);
      clearForm();
      generateCaptcha();
    } else {
      alert("❌ Registration Failed: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Server error. Please try again later.");
  }
}

// === Clear form after success ===
function clearForm() {
  nameInput.value = "";
  numberInput.value = "";
  passwordInput.value = "";
  confirmInput.value = "";
  genderSelect.selectedIndex = 0;
  dobInput.value = "";
  idTypeSelect.selectedIndex = 0;
  idCardInput.value = "";
  citySelect.selectedIndex = 0;
  captchaInput.value = "";
}

// === Attach Event ===
// generateBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   validateForm();
// });

// === OTP Feature ===
let generatedOtp = "";
const otpInput = document.querySelector("#otpInput");
const verifyOtpBtn = document.querySelector("#verifyOtp");
const otpStatus = document.querySelector("#otpStatus");

generateBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // First, validate the form fields before generating OTP
  const name = nameInput.value.trim();
  const number = numberInput.value.trim();
  const captchaVal = captchaInput.value.trim();

  if (name === "" || number === "" || captchaVal === "") {
    alert("Please fill Name, Mobile Number, and Captcha before generating OTP.");
    return;
  }

  if (captchaVal !== captchaText.textContent) {
    alert("Incorrect captcha! Please try again.");
    generateCaptcha();
    captchaInput.focus();
    return;
  }

  // Generate random 6-digit OTP
  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Simulate sending OTP (in real case, send via backend API)
  alert("Your OTP is: " + generatedOtp + " (for demo only)");

  // Show OTP input and verify button
  otpInput.style.display = "inline-block";
  verifyOtpBtn.style.display = "inline-block";
});

// === Verify OTP Button Click ===
verifyOtpBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const enteredOtp = otpInput.value.trim();

  if (enteredOtp === "") {
    alert("Please enter the OTP.");
    return;
  }

  if (enteredOtp === generatedOtp) {
    otpStatus.style.display = "block";
    otpStatus.textContent = "OTP Verified ✅";
    otpStatus.style.color = "green";
    alert("OTP Verified Successfully!");
  } else {
    otpStatus.style.display = "block";
    otpStatus.textContent = "Invalid OTP ❌";
    otpStatus.style.color = "red";
    alert("Invalid OTP! Please try again.");
  }
});

