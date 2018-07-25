var express = require('express')
var router = express.Router()
var ObjectId = require('mongoose').Types.ObjectId;
var { Location, Unicorn } = require('../db/schema')

var mongoose = require('mongoose')
var db = mongoose.connection

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

  const query = { 'unicorns._id': new ObjectId(unicornId) }
  Location.findOne(query,
    (err, location) => {
      if (err) console.error(err)
      else {
        res.json(location.unicorns.id(unicornId))
      }
    }
  )
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
      deleteResponse.success
    )

  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

router.put('/:id/changeLocation', async (req, res) => {
  try {
    const locationId = req.body.locationId

    if (!locationId) {
      sendResponse(res, null, 'no locationId Provided', false)
    } else {
      const deleteResponse = await deleteUnicorn(req.params.id)

      console.log('delete resposne', deleteResponse, !deleteResponse.success)
      if (!deleteResponse.success)
        sendResponse(res, null, 'unable to delete existing unicorn', false)
      else {
        const addResponse = await addUnicorn(locationId, deleteResponse.deletedUnicorn)
        if (!addResponse.success) {
          sendResponse(res, null, 'unable to add unicorn to new location', false)
          /// CRITICAL FAILURE, UNICORN HAS BEEN PERMANENTLY DELETED AT THIS POINT
        } else {
          sendResponse(res, addResponse.newUnicorn, null, true)
        }
      }
    }

  } catch (error) {
    console.error(error)
  }
})

const sendResponse = (res, data, errorMessage, success = true) => {
  if (success) {
    res.json(data)
  } else {
    res.status(403).send(errorMessage)
  }
}

const addUnicorn = async (locationId, unicorn) => {
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

const deleteUnicorn = async (unicornId) => {
  console.log('deleting unicorn', unicornId)
  let success = false
  let deletedUnicorn = {}

  const locations = await Location.find({})
  locations.forEach(async (location) => {
    const unicorn = location.unicorns.id(unicornId)
    if (unicorn) {
      deletedUnicorn = unicorn
      deletedUnicorn.locationId = location._id

      console.log('found unicorn')
      unicorn.remove()
      success = true
      await location.save()
      console.log('success true')
    }
  })

  return {
    success,
    deletedUnicorn
  }
}

module.exports = router
