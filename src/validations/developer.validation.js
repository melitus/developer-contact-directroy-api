const Joi = require('joi');

// accepts name only as letters and converts to uppercase
const name = Joi.string().regex(/^[A-Z]+$/).uppercase();
const categories = Joi.string().alphanum().valid('backend', 'frontend').default('backend');


module.exports = { 
      // GET /developers
  listDevelopers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      email: Joi.string().email().lowercase().required(),
      firstName: name,
      lastName: name,
      userName: name,
      category: categories,
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
        category: categories
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
