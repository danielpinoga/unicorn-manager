var express = require('express')
var router = express.Router()
var { Location } = require('../db/schema')

/* GET home page. */
router.get('/', function (req, res, next) {
  Location.find({})
    .then((data) => {
      res.json({ unicorns: data })
    })
})

module.exports = router
