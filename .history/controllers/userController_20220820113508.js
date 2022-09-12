const User = require("../models/userModel")
exports.login = function () {}

exports.logout = function () {}

exports.register = function (req, res) {
  console.log(req.body)
  let user = new User()

  res.send("Thanks")
}

exports.home = function (req, res) {
  res.render("home-guest")
}
