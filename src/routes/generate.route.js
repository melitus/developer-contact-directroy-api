const express = require('express');

const controller = require('../controllers/otp.controller');

const router = express.Router();

// [POST] generate/otp Generate OTP
router.route('/otp')
  .post(controller.generateOtp);

module.exports = router;