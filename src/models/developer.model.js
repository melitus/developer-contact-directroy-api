const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const jwt = require("jwt-simple");
const uuidv4 = require("uuid/v4");

const APIError = require("../utils/APIError");
const { appKey } = require("../config/keys");

/**
 * Developer Roles
 */
const roles = ["developer", "admin"];

// Developer Categories
const categories = ["backend", "frontend"];

const { Schema } = mongoose;

(SALT_WORK_FACTOR = 10),
  (MAX_LOGIN_ATTEMPTS = 10),
  (LOCK_TIME = 2 * 60 * 60 * 1000);

// Define schema
const DeveloperSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required!"],
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      trim: true,
      minlength: [6, "Password need to be longer!"],
      maxlength: 128
    },
    passwordResetToken: {
      type: String
    },
    passwordResetExpires: {
      type: Date
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0
    },
    lockUntil: {
      type: Number
    },
    profile: {
      firstName: {
        type: String,
        required: [true, "FirstName is required!"],
        trim: true
      },
      lastName: {
        type: String,
        required: [true, "LastName is required!"],
        trim: true
      },
      userName: {
        type: String,
        required: [true, "developerName is required!"],
        trim: true,
        unique: true
      },
      picture: {
        type: String,
        trim: true
      },
      dob: {
        type: String,
        trim: true
      },
      gender: {
        type: String,
        enum: ["male", "female"]
      },
      mobile: {
        type: String,
        trim: false
      },
      location: {
        type: String,
        trim: true
      }
    },
    category: {
      type: String,
      enum: categories,
      default: "backend"
    },
    services: {
      facebook: String,
      google: String
    },
    role: {
      type: String,
      enum: roles,
      default: "developer"
    },
    uuid: {
      type: String,
      default: uuidv4()
    },
    otp: {
      type: Number
    },
    status: {
      emailVerified: {
        type: Boolean,
        default: false
      },
      mobileVerified: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    timestamps: true
  }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
//Password hash middleware.
DeveloperSchema.pre("save", async function save(next) {
  try {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();

    const rounds = appKey.env === "test" ? 1 : 10;

    const hash = await bcrypt.hash(this.password, rounds);

    // set the hashed password back on our developer document
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

DeveloperSchema.virtual("isLocked").get(function() {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual Property for developer's full name
DeveloperSchema.virtual("fullName").get(function() {
  return this.firstName + " " + this.lastName;
});
DeveloperSchema.virtual("fullName").set(function(name) {
  let str = name.split(" ");

  this.firstName = str[0];
  this.lastName = str[1];
});

/**
 * Instance Methods
 */
DeveloperSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "userName",
      "email",
      "picture",
      "password",
      "role",
      "createdAt"
    ];

    fields.forEach(field => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const playload = {
      exp: moment()
        .add(appKey.jwtExpirationInterval, "minutes")
        .unix(),
      iat: moment().unix(),
      sub: this._id
    };
    return jwt.encode(playload, appKey.jwtSecret);
  },

  /**
   * Helper method for validating user's password.
   */
  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },

  incLoginAttempts(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
      return this.update(
        {
          $set: { loginAttempts: 1 },
          $unset: { lockUntil: 1 }
        },
        cb
      );
    }
    // otherwise we're incrementing
    const updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
      updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
  }
});

// expose enum on the model, and provide an internal convenience reference
const reasons = (DeveloperSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
});

// Statics
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
        message: "Developer does not exist",
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },

  getAuthenticated(userName, password, cb) {
    this.findOne({ username: userName }, function(err, developer) {
      if (err) return cb(err);

      // make sure the developer exists
      if (!developer) {
        return cb(null, null, reasons.NOT_FOUND);
      }

      // check if the account is currently locked
      if (developer.isLocked) {
        // just increment login attempts if account is already locked
        return developer.incLoginAttempts(function(err) {
          if (err) return cb(err);
          return cb(null, null, reasons.MAX_ATTEMPTS);
        });
      }

      // test for a matching password
      developer.comparePassword(password, function(err, isMatch) {
        if (err) return cb(err);

        // check if the password was a match
        if (isMatch) {
          // if there's no lock or failed attempts, just return the developer
          if (!developer.loginAttempts && !developer.lockUntil)
            return cb(null, developer);
          // reset attempts and lock info
          var updates = {
            $set: { loginAttempts: 0 },
            $unset: { lockUntil: 1 }
          };
          return developer.update(updates, function(err) {
            if (err) return cb(err);
            return cb(null, developer);
          });
        }

        // password is incorrect, so increment login attempts before responding
        developer.incLoginAttempts(function(err) {
          if (err) return cb(err);
          return cb(null, null, reasons.PASSWORD_INCORRECT);
        });
      });
    });
  },

  // Find developer by email and tries to generate a JWT token

  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email)
      throw new APIError({
        message: "An email is required to generate a token"
      });

    const developer = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true
    };
    if (password) {
      if (developer && (await developer.passwordMatches(password))) {
        return { developer, accessToken: developer.token() };
      }
      err.message = "Incorrect email or password";
    } else if (refreshObject && refreshObject.developerEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = "Invalid refresh token.";
      } else {
        return { developer, accessToken: developer.token() };
      }
    } else {
      err.message = "Incorrect email or refreshToken";
    }
    throw new APIError(err);
  },

  /**
   * List developers in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of developers to be skipped.
   * @param {number} limit - Limit number of developers to be returned.
   * @returns {Promise<developer[]>}
   */
  list({ page = 1, perPage = 30, userName, email, role }) {
    const options = omitBy({ userName, email, role }, isNil);

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
    if (error.name === "MongoError" && error.code === 11000) {
      return new APIError({
        message: "Validation Error",
        errors: [
          {
            field: "email",
            location: "body",
            messages: ['"email" already exists']
          }
        ],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack
      });
    }
    return error;
  },

  async oAuthLogin({ service, id, email, name, picture }) {
    const developer = await this.findOne({
      $or: [
        {
          [`services.${service}`]: id
        },
        { email }
      ]
    });
    if (developer) {
      developer.services[service] = id;
      if (!developer.name) developer.name = name;
      if (!developer.picture) developer.picture = picture;
      return developer.save();
    }
    const password = uuidv4();
    return this.create({
      services: {
        [service]: id
      },
      email,
      password,
      name,
      picture
    });
  },

  async verifyEmail(uuid) {
    if (!uuid)
      throw new APIError({ message: "No token found for verification" });
    try {
      const developer = await this.findOneAndUpdate(
        { uuid },
        { emailVerified: true }
      ).exec();

      if (developer) {
        return { message: "Thank you for verification" };
      }
      throw new APIError({
        message: "Developer does not exist",
        status: httpStatus.NOT_FOUND
      });
    } catch (err) {
      throw new APIError(err);
    }
  },

  async verifyMobileOtp(email, otp) {
    if (!email || !otp)
      throw new APIError({
        message: "Can not verify otp due to insufficient information",
        status: httpStatus.BAD_REQUEST
      });

    try {
      const developer = await this.findOne({ email, otp }).exec();
      if (developer) {
        return { message: "OTP verified" };
      }
      throw new APIError({
        message: "OTP did not match",
        status: httpStatus.NOT_FOUND
      });
    } catch (err) {
      throw new APIError(err);
    }
  },

  async FindOneAndUpdate(query, update) {
    try {
      const developer = await this.findOneAndUpdate(query, update).exec();
      if (developer) {
        return developer;
      }

      throw new APIError({
        message: "Developer does not exist",
        status: httpStatus.NOT_FOUND
      });
    } catch (err) {
      throw new APIError({
        message: "Developer does not exist",
        status: httpStatus.BAD_REQUEST
      });
    }
  }
};

// Compile model from schema
const Developer = mongoose.model("Developer", DeveloperSchema);

module.exports = Developer;
