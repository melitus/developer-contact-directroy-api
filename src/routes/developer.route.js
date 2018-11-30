const express = require('express');
const validate = require('express-validation');

const { authorize, ADMIN, LOGGED_DEVELOPER } = require('../middlewares/auth');
const DeveloperController = require('../controllers/developers.controller');
const {
    listDevelopers,
    createDeveloper,
    replaceDeveloper,
    updateDeveloper
  } = require('../validations/developer.validation');
  
const router = express.Router();

// Load developer when API with developerId route parameter is hit
router.param('developerId', DeveloperController.load);

// GET- /developer/profile Developer Profile
router
  .route('/profile')
  .get(authorize(), DeveloperController.loggedIn);

router.route('/')
    .get(authorize(ADMIN), validate(listDevelopers), DeveloperController.listDevelopers)
    .post(authorize(ADMIN), validate(createDeveloper), DeveloperController.createDeveloper);

router.route('/:developerId')
    .get(authorize(LOGGED_DEVELOPER), DeveloperController.getDeveloperById)
    .put(authorize(LOGGED_DEVELOPER), validate(replaceDeveloper), DeveloperController.replaceDeveloper) // [PUT] Replace the whole developer document with a new one
    .patch(authorize(LOGGED_DEVELOPER), validate(updateDeveloper), DeveloperController.updateDeveloper) // Update some fields of a developer document
    .delete(authorize(LOGGED_DEVELOPER), DeveloperController.deleteDeveloperById);        
                  
module.exports = router;
