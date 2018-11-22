const express = require('express');

const DeveloperController = require('../controllers/developers.controller');

const router = express.Router();

router.route('/developers')
    .get(DeveloperController.getAllDeveloper)
    .post(DeveloperController.createDeveloper);

router.route('/developers/:developerId')
    .get(DeveloperController.getDeveloperById)
    .put(DeveloperController.updateDeveloperById)
    .delete(DeveloperController.deleteDeveloperById);        
                  
module.exports = router;
