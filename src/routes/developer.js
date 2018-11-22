const express = require('express');
const router = require('express-promise-router')();

const DeveloperController = require('../controllers/Developer');

router.route('/')
    .get(DeveloperController.getAllDeveloper)
    .post(DeveloperController.createDeveloper);

router.route('/:developerId')
    .get(DeveloperController.getDeveloperById)
    .put(DeveloperController.updateDeveloperById)
    .delete(DeveloperController.deleteDeveloperById);        
                  
module.exports = router;