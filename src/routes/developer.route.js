const express = require('express');
const validate = require('express-validation');

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
  .get( DeveloperController.loggedIn);

router.route('/')
    .get(validate(listDevelopers), DeveloperController.listDevelopers)
    .post(validate(createDeveloper), DeveloperController.createDeveloper);

router.route('/:developerId')
    .get(DeveloperController.getDeveloperById)
    .put(validate(replaceDeveloper), DeveloperController.replaceDeveloper) // [PUT] Replace the whole developer document with a new one
    .patch(validate(updateDeveloper), DeveloperController.updateDeveloper) // Update some fields of a developer document
    .delete(DeveloperController.deleteDeveloperById);        
                  
module.exports = router;
