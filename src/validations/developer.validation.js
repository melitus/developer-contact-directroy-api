const Joi = require('joi');

const Developer = require('../models/developer.model');


// accepts name only as letters and converts to uppercase
const name = Joi.string().regex(/^[A-Z]+$/).uppercase();
const categories = Joi.string().alphanum().valid('backend', 'frontend').default('backend');


module.exports = { 
      // GET /developers
  listDevelopers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(Developer.roles),
    },
  },

  // POST /developers
  createDeveloper: {
    body: {
        email: Joi.string().email().lowercase().required(),
        firstName: name,
        lastName: name,
        userName: name,
        password: Joi.string().min(6).max(128).required(),
        role: Joi.string().valid(Developer.roles),
    },
  },

  // PUT /developers/:developerId
  replaceDeveloper: {
    body: {
        email: Joi.string().email().lowercase().required(),
        firstName: name,
        lastName: name,
        userName: name,
        password: Joi.string().min(6).max(128).required(),
        category: categories,
    },
    params: {
      developerId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

}
