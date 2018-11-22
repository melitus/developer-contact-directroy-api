const mongoose = require('mongoose')
const { Schema } = mongoose

const DeveloperSchema = new Schema({
  email: String,
  username: String,
  password: String,
  Created_date: {
    type: Date,
    default: Date.now
  },
  category: [{
    type: String,
    enum: ['backend', 'frontend' ]
  }],
  default: ['backend']
})

const Developer = mongoose.model('developer', DeveloperSchema)

module.exports = Developer;
