const httpStatus = require('http-status');
const moment = require('moment-timezone');

const Developer = require('../models/developer.model');
const RefreshToken = require('../models/refreshToken.model');
const { jwtExpirationInterval } = require('../config/vars');
const { sendVerificationEmail } = require('./verification.controller');
const { sendVerificationMail, sendVerificationSms } = require('../config/vars');

/**
* Returns a formated object with tokens
* @private
*/
function generateTokenResponse(developer, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(developer).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType, accessToken, refreshToken, expiresIn,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const developer = await (new Developer(req.body)).save();
    const developerTransformed = developer.transform();
    const token = generateTokenResponse(developer, developer.token());
    res.status(httpStatus.CREATED);
    if(sendVerificationMail) {
      sendVerificationEmail(developer.uuid, { to: developerTransformed.email });
    }
    return res.json({ token, developer: developerTransformed });
  } catch (error) {
    return next(Developer.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid developername and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { developer, accessToken } = await Developer.findAndGenerateToken(req.body);
    const token = generateTokenResponse(developer, accessToken);
    const developerTransformed = developer.transform();
    return res.json({ token, developer: developerTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing developer or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { developer } = req;
    const accessToken = developer.token();
    const token = generateTokenResponse(developer, accessToken);
    const developerTransformed = developer.transform();
    return res.json({ token, developer: developerTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      developerEmail: email,
      token: refreshToken,
    });
    const { developer, accessToken } = await Developer.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(developer, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};
