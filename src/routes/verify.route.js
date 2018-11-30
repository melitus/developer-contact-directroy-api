const express = require('express');

const verifycontroller = require('../controllers/verification.controller');

const router = express.Router();

// [GET] verify/email/:uuid Verify email
router.route('/email/:uuid')
  .get(verifycontroller.verifyDeveloperEmail);


// [POST] verify/otp Verify OTP
router.route('/otp')
  .post(verifycontroller.verifyMobileOtp);

module.exports = router;