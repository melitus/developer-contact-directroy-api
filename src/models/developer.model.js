const mongoose = require('mongoose');
import validator from 'validator';

const { Schema } = mongoose

const DeveloperSchema = new Schema({
email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true,
    validate: {
        validator(email) {
            return validator.isEmail(email);
        },
        message: '{VALUE} is not a valid email!',
    },
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
    validate: {
        validator(password) {
            return passwordReg.test(password);
        },
        message: '{VALUE} is not a valid password!',
    },
 },
  createdAt: { 
    type: Date, 
    default: Date.now },    
  category: [{ 
    type: String, 
    enum: ['backend', 'frontend' ]}],
  default: ['developer']
})

const Developer = mongoose.model('developer', DeveloperSchema)

module.exports = Developer;
