require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
var db = mongoose.connection

const { Unicorn } = require('./schema')
const { Location } = require('./schema')

const purpleUnicorn = new Unicorn({
  name: 'Danny',
  color: 'purple'
})

const greenUnicorn = new Unicorn({
  name: 'Johnson',
  color: 'green'
})

const brownUnicorn = new Unicorn({
  name: 'Secretly just a horse',
  color: 'brown'
})

const pasture = new Location({
  name: 'Pasture',
  unicorns: [purpleUnicorn]
})

const barn = new Location({
  name: 'Barn',
  unicorns: [greenUnicorn]
})

const corral = new Location({
  name: 'Corral',
  unicorns: [brownUnicorn]
})

const saveSeeds = async () => {
  try {
    await Location.remove({})
    await pasture.save()
    await barn.save()
    await corral.save()
    console.log("seeded!")
  } catch (error) {
    console.error(error)
  } finally {
    db.close()
  }
}

saveSeeds()