var express = require('express')
var router = express.Router()
var { Location, Unicorn } = require('../db/schema')

router.get('/', async (req, res) => {
  const allUnicorns = []
  const allLocations = await Location.find({})

  allLocations.forEach(location => {
    location.unicorns.forEach(unicorn => {
      const updatedUnicorn = {
        _id: unicorn._id,
        name: unicorn.name,
        color: unicorn.color,
        location: location.name
      }
      allUnicorns.push(updatedUnicorn)
    })
  })

  res.json(allUnicorns)
})

router.get('/:id', async (req, res) => {
  const unicornId = req.params.id
  let oneUnicorn = {}

  const allLocations = await Location.find({})
  allLocations.forEach(location => {
    location.unicorns.forEach(unicorn => {
      if (unicorn._id == unicornId) {
        const updatedUnicorn = {
          _id: unicorn._id,
          name: unicorn.name,
          color: unicorn.color,
          location: location.name
        }
        oneUnicorn = updatedUnicorn
      }

    })
  })

  res.json(oneUnicorn)
})

router.put('/:id', async (req, res) => {
  try {
    console.log('request body', req.body)
    const unicornId = req.params.id
    const updatedUnicorn = req.body
    let oneUnicorn = {}

    const locations = await Location.find({})
    locations.forEach(async (location) => {
      const unicorn = location.unicorns.id(unicornId)
      if (unicorn) {
        unicorn.name = updatedUnicorn.name || unicorn.name
        unicorn.color = updatedUnicorn.color || unicorn.color
        await location.save()
        res.json(unicorn)
      }
    })
  } catch (error) {
    console.error(erro)
  } finally {
    res.status(403)
  }
})

module.exports = router
