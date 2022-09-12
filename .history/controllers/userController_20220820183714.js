const User = require("../models/userModel")

exports.logout = function () {}

exports.register = function (req, res) {
  let user = new User(req.body)
  user.register()
  if (user.errors.length) {
    res.send(user.errors)
  } else {
    res.send("Thanks, congrats with registration")
  }
}

exports.login = function (req, res) {
  let user = new User(req.body)
  user.login(function (message) {
    res.send(message)
  })
}

exports.home = function (req, res) {
  res.render("home-guest")
}
