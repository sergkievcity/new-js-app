const User = require("../models/userModel")
exports.login = function () {}

exports.logout = function () {}

exports.register = function (req, res) {
  let user = new User(req.body)
  user.register()
  if (user.errors.length) {
    res.send(user.errors)
  } else {
    res.send("Thanks")
  }
}

exports.home = function (req, res) {
  res.render("home-guest")
}
