const express = require('express');
const validate = require('express-validation');

const authController = require('../controllers/auth.controller');
const oAuthLogin = require('../middlewares/auth').oAuth;
const {
  login,
  register,
  oAuth,
  refresh,
} = require('../validations/auth.validation');

const router = express.Router();

// [POST] auth/register Register
router.route('/register')
  .post(validate(register), authController.register);

// [POST] auth/login Login
router.route('/login')
  .post(validate(login), authController.login);


// [POST] auth/refresh-token Refresh Token
router.route('/refresh-token')
  .post(validate(refresh), authController.refresh);


// [POST] auth/reset-password
 


// [POST] auth/facebook Facebook Login
router.route('/facebook')
  .post(validate(oAuth), oAuthLogin('facebook'), authController.oAuth);

// [POST] auth/google Google Login
router.route('/google')
  .post(validate(oAuth), oAuthLogin('google'), authController.oAuth);


module.exports = router;
