const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UnicornSchema = new Schema({
  name: String,
  color: String
})

const LocationSchema = new Schema({
  name: String,
  unicorns: [UnicornSchema]
})

const Unicorn = mongoose.model('Unicorn', UnicornSchema)
const Location = mongoose.model('Location', LocationSchema)

module.exports = {
  Unicorn,
  Location
}