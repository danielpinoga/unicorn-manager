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

router.post('/', async (req, res) => {
  try {
    const locationId = req.body.locationId
    const unicorn = req.body.unicorn
    const addResponse = await addUnicorn(locationId, unicorn)
    sendResponse(
      res,
      addResponse.newUnicorn,
      'could not add unicorn',
      addResponse.success)
  } catch (error) {
    console.error(error)
  }
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
    const unicornId = req.params.id
    const updatedUnicorn = req.body
    let unicornFound = false
    let unicornToReturn = {}

    const locations = await Location.find({})
    locations.forEach(async (location) => {
      const unicorn = location.unicorns.id(unicornId)
      if (unicorn) {
        unicorn.name = updatedUnicorn.name || unicorn.name
        unicorn.color = updatedUnicorn.color || unicorn.color

        unicornFound = true
        unicornToReturn = unicorn

        await location.save()
      }
    })

    sendResponse(res, unicornToReturn, 'could not find unicorn to update', unicornFound)

  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleteResponse = await deleteUnicorn(req.params.id)

    sendResponse(
      res,
      { result: 'Successfully deleted unicorn!' },
      'Could not find unicorn to delete',
      deleteResponse.unicornFound
    )

  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

sendResponse = (res, data, errorMessage, success = true) => {
  if (success) {
    res.json(data)
  } else {
    res.status(403).send(errorMessage)
  }
}

addUnicorn = async (locationId, unicorn) => {
  const location = await Location.findById(locationId)

  const newUnicorn = new Unicorn(unicorn)
  location.unicorns.push((newUnicorn))
  await location.save()

  console.log(location)
  return {
    newUnicorn,
    success: true
  }

}

deleteUnicorn = async (unicornId) => {
  let unicornFound = false
  let deletedUnicorn = {}

  const locations = await Location.find({})
  locations.forEach(async (location) => {
    const unicorn = location.unicorns.id(unicornId)
    if (unicorn) {
      unicornFound = true
      deletedUnicorn = unicorn

      unicorn.remove()
      await location.save()
    }
  })

  return {
    unicornFound,
    deletedUnicorn
  }
}

module.exports = router
