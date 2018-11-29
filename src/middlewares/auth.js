const httpStatus = require('http-status');
const passport = require('passport');

const Developer = require('../models/developer.model');
const APIError = require('../utils/APIError');

const ADMIN = 'admin';
const LOGGED_DEVELOPER = '_loggedDeveloper';

const handleJWT = (req, res, next, roles) => async (err, developer, info) => {
  const error = err || info;
  const logIn = Promise.promisify(req.logIn);
  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: httpStatus.UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });

  try {
    if (error || !developer) throw error;
    await logIn(developer, { session: false });
  } catch (e) {
    return next(apiError);
  }
developer
  if (roles === LOGGED_DEVELOPER) {
    if (developer.role !== 'admin' && req.params.developerId !== developer._id.toString()) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Forbidden';
      return next(apiError);
    }
  } else if (!roles.includes(developer.role)) {
    apiError.status = httpStatus.FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  } else if (err || !developer) {
    return next(apiError);
  }

  req.developer = developer;

  return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_DEVELOPER = LOGGED_DEVELOPER;

exports.authorize = (roles = Developer.roles) => (req, res, next) =>
  passport.authenticate(
    'jwt', { session: false },
    handleJWT(req, res, next, roles),
  )(req, res, next);

exports.oAuth = service =>
  passport.authenticate(service, { session: false });
