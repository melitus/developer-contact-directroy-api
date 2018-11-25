const mongoose = require('mongoose');

const { Schema } = mongoose

// Developer Categories
const categoies = ['backend', 'frontend'];

const DeveloperSchema = new Schema({
email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true,
    lowercase: true,
 },
  firstName: {
    type: String,
    required: [true, 'FirstName is required!'],
    trim: true,
 },
  lastName: {
    type: String,
    required: [true, 'LastName is required!'],
    trim: true,
 },
  userName: {
    type: String,
    required: [true, 'UserName is required!'],
    trim: true,
    unique: true,
 },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    trim: true,
    minlength: [6, 'Password need to be longer!'],
    maxlength: 128,
 },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },    
  category: { 
    type: String, 
    enum: categoies,
    default: 'backend',
  },
})

const Developer = mongoose.model('developer', DeveloperSchema)

module.exports = Developer;
