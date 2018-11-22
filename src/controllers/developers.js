const mongoose = require('mongoose');
const DeveloperModel = require('../models/developer');

module.exports = {
    
    createDeveloper: async (req, res, next) => {
        // . Create a new Developer
        const newDeveloper = req.body;
        const Developer = new DeveloperModel(newDeveloper);
        await Developer.save();        
        res.status(200).json({Developer});
    },
    getDeveloperById: async (req, res, next) => {    
        const { developerId } = req.value.params;;
        console.log('getDeveloper', DeveloperId);   
        const Developer = await DeveloperModel.findById(developerId);
        res.status(200).json({Developer});
    },

    getAllDeveloper: async (req, res, next) => {    
        const Developers = await DeveloperModel.find({});            
        res.status(200).json({Developers});     
    },
    updateDeveloperById: async (req, res, next) => {
        const { developerId } = req.value.params;
        const newDeveloper = req.value.body;            
        const result = await DeveloperModel.findByIdAndUpdate(developerId, newDeveloper);
        res.status(200).json(result);         
    }, 
    deleteDeveloperById: async (req, res, next) => {    
        const { developerId } = req.value.params;
        // get a Developer
        const Developer = await DeveloperModel.findByIdAndRemove(developerId);
        if (!Developer) {
            res.status(404).json({error: 'Developer does not exist'});
        }
        // remove the Developer
        await Developer.remove();
        res.status(200).json({ message: 'Developer successfully deleted' });
    },
    
};