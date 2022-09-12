const User = require("../models/userModel")

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
      res.render("home-dashboard", { user: user.data.username })
    })
    .catch(function (error) {
      res.send(error)
    })
}

exports.logout = function (req, res) {
  req.session.destroy()
  res.send("you are now logged out")
}

exports.home = function (req, res) {
  if (req.session.user) {
    res.render("home-dashboard", { user: req.session.user.username })
  } else {
    res.render("home-guest")
  }
}
