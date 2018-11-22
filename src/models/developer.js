const mongoose = require('mongoose')
const { Schema } = mongoose

const DeveloperSchema = new Schema({
  email: String,
  username: String,
  password: String
}, {
  category: {
    frontend: String,
    backend: String
  }
})

const Developer = mongoose.model('developer', DeveloperSchema)

module.exports = Developer;