var express = require('express')
var router = express.Router()
var { Location, Unicorn } = require('../db/schema')

router.get('/', (req, res) => {
  Location.find({})
    .then((data) => {
      const allUnicorns = []
      data.forEach(location => {
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
})

router.get('/:id', (req, res) => {
  const unicornId = req.params.id
  let oneUnicorn = {}
  Location.find({})
    .then((data) => {
      data.forEach(location => {
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
})

module.exports = router
