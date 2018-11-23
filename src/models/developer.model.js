const mongoose = require('mongoose')
const { Schema } = mongoose

const DeveloperSchema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },    
  category: [{ type: String, enum: ['backend', 'frontend' ]}],
  default: ['developer']
})

const Developer = mongoose.model('developer', DeveloperSchema)

module.exports = Developer;
