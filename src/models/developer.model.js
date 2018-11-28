const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');

const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../config/vars');

/**
 * Developer Roles
 */
const roles = ['developer', 'admin'];

// Developer Categories
const categories = ['backend', 'frontend'];

const { Schema } = mongoose



// Define schema
const DeveloperSchema = new Schema({
email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true,
    lowercase: true,
 },
  firstName: {
    type: String,
    required: [true, 'FirstName is required!'],
    trim: true,
 },
  lastName: {
    type: String,
    required: [true, 'LastName is required!'],
    trim: true,
 },
  userName: {
    type: String,
    required: [true, 'UserName is required!'],
    trim: true,
    unique: true,
 },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    trim: true,
    minlength: [6, 'Password need to be longer!'],
    maxlength: 128,
 },
  category: { 
    type: String, 
    enum: categories,
    default: 'backend',
  },
  services: {
    facebook: String,
    google: String,
  },
  role: {
    type: String,
    enum: roles,
    default: 'developer',
  },
  picture: {
    type: String,
    trim: true,
  },
  dob: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  mobile: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  uuid: {
    type: String,
    default: uuidv4(),
  },
  otp: {
    type: Number,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  mobileVerified: {
    type: Boolean,
    default: false,
  },
},{
  timestamps: true,
});


/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
DeveloperSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const rounds = env === 'test' ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Virtual Property
 */

DeveloperSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName
})
DeveloperSchema.virtual('fullName').set(function(name) {
  let str = name.split(' ')
  
  this.firstName = str[0]
  this.lastName = str[1]
})


/**
 * Instance Methods
 */
DeveloperSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'picture', 'role', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});


/**
 * Statics
 */
DeveloperSchema.statics = {

  roles,

  // Get developer
  async get(id) {
    try {
      let developer;

      if (mongoose.Types.ObjectId.isValid(id)) {
        developer = await this.findById(id).exec();
      }
      if (developer) {
        return developer;
      }

      throw new APIError({
        message: 'Developer does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

// Find developer by email and tries to generate a JWT token

  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const user = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (user && await user.passwordMatches(password)) {
        return { user, accessToken: user.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * List developers in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of developers to be skipped.
   * @param {number} limit - Limit number of developers to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    page = 1,
    perPage = 30,
    name,
    email,
    role,
  }) {
    const options = omitBy({ name, email, role }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },

  async oAuthLogin({
    service,
    id,
    email,
    name,
    picture,
  }) {
    const user = await this.findOne({
      $or: [{
        [`services.${service}`]: id
      }, { email }]
    });
    if (user) {
      user.services[service] = id;
      if (!user.name) user.name = name;
      if (!user.picture) user.picture = picture;
      return user.save();
    }
    const password = uuidv4();
    return this.create({
      services: {
        [service]: id
      },
      email,
      password,
      name,
      picture,
    });
  },

  async verifyEmail(uuid) {
    if (!uuid) throw new APIError({ message: 'No token found for verification' });
    try {
      const user = await this.findOneAndUpdate({ uuid }, { emailVerified: true }).exec();
      
      if(user) {
        return { message: 'Thank you for verification' }
      }
      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch(err) {
      throw new APIError(err);
    }
  },

  async verifyMobileOtp(email, otp) {
    if(!email || !otp) throw new APIError({ message: 'Can not verify otp due to insufficient information', status: httpStatus.BAD_REQUEST });

    try {
      const user = await this.findOne({ email, otp }).exec();
      if(user) {
        return { message: 'OTP verified' };
      }
      throw new APIError({
        message: 'OTP did not match',
        status: httpStatus.NOT_FOUND,
      });
    } catch(err) {
      throw new APIError(err);
    }
  },

  async FindOneAndUpdate(query, update) {
    try {
      const user = await this.findOneAndUpdate(query, update).exec();
      if(user) {
        return user
      }

      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch(err) {
      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.BAD_REQUEST,
      });
    }
  },
};



// Compile model from schema
const Developer = mongoose.model('Developer', DeveloperSchema)

module.exports = Developer;
