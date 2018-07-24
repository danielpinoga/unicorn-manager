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

module.exports = router
