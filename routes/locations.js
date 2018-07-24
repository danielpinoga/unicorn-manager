var express = require('express')
var router = express.Router()
var { Location } = require('../db/schema')

router.get('/', (req, res) => {
  Location.find({})
    .then((data) => {
      res.json(data)
    })
})

router.get('/:id', (req, res) => {
  Location.findById(req.params.id)
    .then((data) => {
      res.json(data)
    })
})

module.exports = router
