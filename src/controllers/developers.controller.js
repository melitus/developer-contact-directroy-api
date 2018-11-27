const httpStatus = require('http-status');
const { omit } = require('lodash');

const Developer = require('../models/developer.model');
const { handler: errorHandler } = require('../middlewares/error');

module.exports = {
    // Load developer and append to req.
    load: async (req, res, next, id) => {
        try {
          const developer = await Developer.get(id);
          req.locals = { developer };
          return next();
        } catch (error) {
          return errorHandler(error, req, res);
        }
      },
    //  Get developer
    getDeveloperById: (req, res) => res.json(req.locals.developer.transform()),

    // Get logged in developer info
    loggedIn: (req, res) => res.json(req.developer.transform()),

    createDeveloper: async (req, res, next) => {
        try{
        // . Create a new Developer
            const newDeveloper = req.body;
            const developer = new Developer(newDeveloper);
            const savedDeveloper = await developer.save();        
            res.status(httpStatus.CREATED);
            res.json(savedDeveloper.transform());
        } catch (error) {
            next(Developer.checkDuplicateEmail(error));
        }

    },
    getDeveloperById: async (req, res, next) => {  
        try{
            const { developerId } = req.params;;
            //console.log('getDeveloper', developerId);   
            const Developer = await Developer.findById(developerId);
            res.status(200).json({Developer});
        }  catch (error){
            next(error);
        } 
    },
    getAllDeveloper: async (req, res, next) => {  
        try{  
            const { developerId } = req.params;;
            console.log('getDeveloper', developerId);
            const Developers = await Developer.find({});            
            res.status(200).json({Developers}); 
        } catch(error) {
            next(error);
        }    
    },

    // Replace existing developer
    replaceDeveloper: async (req, res, next) => {
        try {
        const { developer } = req.locals;
        const newDeveloper = new developer(req.body);
        const ommitRole = developer.role !== 'admin' ? 'role' : '';
        const newDeveloperObject = omit(newDeveloper.toObject(), '_id', ommitRole);
    
        await developer.update(newDeveloperObject, { override: true, upsert: true });
        const savedDeveloper = await developer.findById(developer._id);
    
        res.json(savedDeveloper.transform());
        } catch (error) {
        next(developer.checkDuplicateEmail(error));
        }
  },
  
    //Update existing developer
    updateDeveloper: async (req, res, next) => {
        try{
            const ommitRole = req.locals.developer.role !== 'admin' ? 'role' : '';
            const updatedDeveloper = omit(req.body, ommitRole);
            const developer = Object.assign(req.locals.developer, updatedDeveloper);
            const savedDeveloper = await developer.save()
            res.status(200).json(savedDeveloper.transform());          
        } catch(error) {
            next(Developer.checkDuplicateEmail(error));
        }   
    }, 

     // Get developer list
    listDevelopers: async (req, res, next) => {
    try {
      const developer = await Developer.list(req.query);
      const transformedDevelopers = developer.map(developer => developer.transform());
      res.json(transformedDevelopers);
    } catch (error) {
      next(error);
    }
  },

    deleteDeveloperById: async (req, res, next) => {  
        try{  
        const { developerId } = req.params;
        // get a Developer
        const Developer = await Developer.findByIdAndRemove(developerId);
        if (!Developer) {
            res.status(404).json({error: 'Developer does not exist'});
        }
        // remove the Developer
        await Developer.remove();
        res.status(200).json({ message: 'Developer successfully deleted' });
    
    } catch (error) {
       next(error);
    }  
}
}