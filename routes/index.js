var express = require('express')
var router = express.Router()

router.get('/', (req, res) => {
  const instructions = {
    avaiableApiEndpoints: {
      locations: [{
        getAllLocations: {
          method: 'get',
          url: '/locations',
          function: 'return all locations and unicorns for those locations'
        }
      }, {
        getOneLocations: {
          method: 'get',
          url: '/locations/:id',
          function: 'return one location (by id) and unicorns for that location'
        }
      }],
      unicorns: [{
        getAllUnicorns: {
          method: 'get',
          url: '/unicorns',
          function: 'return all unicorns (with locations)'
        }
      }, {
        getOneUnicorn: {
          method: 'get',
          url: '/unicorns/:id',
          function: 'get single unicorn (by id)'
        }
      }, {
        addNewUnicorn: {
          method: 'post',
          url: '/unicorns',
          function: 'add new unicorn',
          requiredBodyParams: {
            locationId: 'String',
            unicorn: {
              name: 'String',
              description: 'String'
            }
          }
        }
      }, {
        updateUnicorn: {
          method: 'put',
          url: '/unicorns/:id',
          function: 'update existing unicorn (by id)',
          requiredBodyParams: {
            locationId: 'String'
          },
          optionalBodyParams: {
            name: 'String',
            description: 'String'
          }
        }
      }, {
        deleteUnicorn: {
          method: 'delete',
          url: '/unicorn/:id',
          function: 'delete existing unicorn (by id)'
        }
      }, {
        changeUnicornLocation: {
          method: 'put',
          url: '/:id/changeLocation',
          function: 'move unicorn location',
          requiredBodyParams: {
            newLocationId: 'String'
          }
        }
      }]
    }
  }

  res.json(instructions)
})

module.exports = router
