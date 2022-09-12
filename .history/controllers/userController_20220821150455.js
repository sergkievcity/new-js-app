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
  user
    .login()
    .then(function (result) {
      req.session.user = { favColor: "blue", username: user.data.username }
      res.send(result)
    })
    .catch(function (error) {
      res.send(error)
    })
}

exports.home = function (req, res) {
  if (req.session.user) {
    res.render("Welcome to the actual application")
  } else {
    res.send("home-guest")
  }
}
