const httpStatus = require('http-status');
const DeveloperModel = require('../models/developer.model');

module.exports = {
    
    createDeveloper: async (req, res, next) => {
        try{
        // . Create a new Developer
            const newDeveloper = req.body;
            const Developer = new DeveloperModel(newDeveloper);
            await Developer.save();        
            res.status(httpStatus.CREATED).json({Developer});
        } catch (error) {
            next(error);
        }
    },
    getDeveloperById: async (req, res, next) => {  
        try{
            const { _id } = req.params;;
           // console.log('getDeveloper', developerId);   
            const Developer = await DeveloperModel.findById({id: _id});
            res.status(200).json({Developer});
        }  catch (error){
            next(error);
        } 
    },
    getAllDeveloper: async (req, res, next) => {  
        try{  
            const { developerId } = req.params;;
            console.log('getDeveloper', developerId);
        const Developers = await DeveloperModel.find({});            
        res.status(200).json({Developers}); 
        } catch(error) {
            next(error);
        }    
    },
    updateDeveloperById: async (req, res, next) => {
        try{
        const { developerId } = req.params;
        const newDeveloper = req.body;            
        const result = await DeveloperModel.findByIdAndUpdate({_id: developerId}, newDeveloper);
        res.status(200).json(result);      
        } catch(error) {
            next(error);
        }   
    }, 
    deleteDeveloperById: async (req, res, next) => {  
        try{  
        const { developerId } = req.params;
        // get a Developer
        const Developer = await DeveloperModel.findByIdAndRemove({_id: developerId});
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