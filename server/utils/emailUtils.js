const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "youremail@gmail.com",
    pass: "app password", // Generate an app password using Google 2-factor authentication
  },
  secure: true,
});

function encryptedStr() {
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialCharacters = "@$!%*?&";

  const allCharacters =
    lowercaseLetters + uppercaseLetters + numbers + specialCharacters;

  // Ensure at least one character from each character set
  const randomLowercase = lowercaseLetters[Math.floor(Math.random() * 26)];
  const randomUppercase = uppercaseLetters[Math.floor(Math.random() * 26)];
  const randomDigit = numbers[Math.floor(Math.random() * 10)];
  const randomSpecial = specialCharacters[Math.floor(Math.random() * 7)];

  // Generate the remaining characters
  const remainingLength = 8 - 4; // Minimum length minus the characters already chosen
  let randomRemaining = "";
  for (let i = 0; i < remainingLength; i++) {
    randomRemaining +=
      allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Combine all characters
  const password =
    randomLowercase +
    randomUppercase +
    randomDigit +
    randomSpecial +
    randomRemaining;

  return password;
}

function generateVerificationLink(userId) {
  return `http://localhost:3001/auth/verify-account?userId=${userId}`;
}

function sendMail(mailData, callback) {
  transporter.sendMail(mailData, callback);
}

module.exports = { encryptedStr, generateVerificationLink, sendMail };
