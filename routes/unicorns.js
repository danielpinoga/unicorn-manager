var express = require('express')
var router = express.Router()
var ObjectId = require('mongoose').Types.ObjectId;
var { Location, Unicorn } = require('../db/schema')

router.get('/', async (req, res) => {
  try {
    const allUnicorns = []
    const allLocations = await Location.find({})

    allLocations.forEach(location => {
      location.unicorns.forEach(unicorn => {
        const updatedUnicorn = addLocationToUnicorn(unicorn, location)
        allUnicorns.push(updatedUnicorn)
      })
    })

    sendSuccessResponse(res, allUnicorns)
  } catch (error) {
    console.error(error)
    sendErrorResponse(res, error.message)
  }
})

router.post('/', async (req, res) => {
  try {
    const locationId = req.body.locationId
    const unicorn = req.body.unicorn

    const addResponse = await addUnicornToDB(locationId, unicorn)
    sendResponse(res, addResponse.newUnicorn, 'Could not add unicorn', addResponse.success)

  } catch (error) {
    console.error(error)
    sendErrorResponse(req, error.message)
  }
})

router.get('/:id', async (req, res) => {
  const unicornId = req.params.id

  const query = { 'unicorns._id': new ObjectId(unicornId) }
  const location = await Location.findOne(query)

  if (location) {
    const unicorn = location.unicorns.id(unicornId)
    sendResponse(res, unicorn, 'unable to find unicorn', !!unicorn)
  } else {
    sendErrorResponse(res, 'unable to find unicorn')
  }
})

router.put('/:id', async (req, res) => {
  try {
    const unicornId = req.params.id
    const updatedUnicorn = req.body

    const query = { 'unicorns._id': new ObjectId(unicornId) }
    const location = await Location.findOne(query)

    if (location) {
      const unicorn = location.unicorns.id(unicornId)
      if (unicorn) {
        unicorn.name = updatedUnicorn.name || unicorn.name
        unicorn.color = updatedUnicorn.color || unicorn.color

        await location.save()
        sendSuccessResponse(res, unicorn)

      } else {
        sendErrorResponse(res, 'unable to find unicorn', 409)
      }
    } else {
      sendErrorResponse(res, 'unable to find location with unicorn', 409)
    }

  } catch (error) {
    console.error(error)
    sendErrorResponse(res, error.message)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleteResponse = await deleteUnicorn(req.params.id)
    const successObject = { result: 'Successfully deleted unicorn!' }

    sendResponse(res, successObject, 'Could not find unicorn to delete', deleteResponse.success)
  } catch (error) {
    console.error(error)
    sendErrorResponse(res, error.message)
  }
})

router.put('/:id/changeLocation', async (req, res) => {
  try {
    const locationId = req.body.newLocationId

    if (locationId) {
      const deleteResponse = await deleteUnicornFromDB(req.params.id)

      if (deleteResponse.success) {
        const addResponse = await addUnicorn(locationId, deleteResponse.deletedUnicorn)
        if (addResponse.success) {
          sendSuccessResponse(res, addResponse.newUnicorn)
        } else {
          /// CRITICAL FAILURE, UNICORN HAS BEEN PERMANENTLY DELETED AT THIS POINT
          sendErrorResponse(res, 'unable to add unicorn to new location', 500)
        }
      } else {
        sendErrorResponse(res, 'unable to delete existing unicorn', 500)
      }
    } else {
      sendErrorResponse(res, 'no locationId Provided', 400)
    }

  } catch (error) {
    console.error(error)
    sendErrorResponse(res, error.message)
  }
})

const addLocationToUnicorn = (unicorn, location) => {
  return {
    ...unicorn.toObject(),
    location: location.name
  }
}

const sendResponse = (res, data, errorMessage, success, errorStatus = 400) => {
  if (success) {
    sendSuccessResponse(res, data)
  } else {
    sendErrorResponse(res, errorMessage, errorStatus)
  }
}

const sendSuccessResponse = (res, data) => {
  res.json(data)
}

const sendErrorResponse = (res, errorMessage, errorStatus = 500) => {
  res.status(errorStatus).send(errorMessage)
}

const addUnicornToDB = async (locationId, unicorn) => {
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

const deleteUnicornFromDB = async (unicornId) => {
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
