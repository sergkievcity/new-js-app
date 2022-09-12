const user = require("../models/User")
exports.login = function () {}

exports.logout = function () {}

exports.register = function (req, res) {
  console.log(req.body)
  res.send("Thanks")
}

exports.home = function (req, res) {
  res.render("home-guest")
}
