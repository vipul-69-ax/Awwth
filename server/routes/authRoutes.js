const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);

router.get("/verify-account", authController.verifyAccount);
router.get("/forgot-password", authController.forgotPasswordGET)
module.exports = router;
