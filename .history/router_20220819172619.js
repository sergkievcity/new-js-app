const express = require("express")
const router = express.Router()
const userController = require("./controllers/userController")

router.get("/", userController.home)

router.get("/about", function (req, res) {
  res.render("about")
})

module.exports = router
