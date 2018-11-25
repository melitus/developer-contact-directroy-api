const express = require('express');
const validate = require('express-validation');

const DeveloperController = require('../controllers/developers.controller');
const {
    listDevelopers,
    createDeveloper,
    updateDeveloper
  } = require('../validations/developer.validation');
  
const router = express.Router();

router.route('/developers')
    .get(validate(listDevelopers), DeveloperController.getAllDeveloper)
    .post(validate(createDeveloper), DeveloperController.createDeveloper);

router.route('/developers/:developerId')
    .get(DeveloperController.getDeveloperById)
    .put(validate(updateDeveloper), DeveloperController.updateDeveloperById)
    .delete(DeveloperController.deleteDeveloperById);        
                  
module.exports = router;
