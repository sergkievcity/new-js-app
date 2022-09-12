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
      req.session.save(function () {
        res.redirect("/")
      })
    })
    .catch(function (error) {
      // req.session.flash.errors = [error]
      req.flash("errors", error)
      req.session.save(function () {
        res.redirect("/")
      })
    })
}

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect("/")
  })
}

exports.home = function (req, res) {
  if (req.session.user) {
    res.render("home-dashboard", { user: req.session.user.username })
  } else {
    res.render("home-guest", { errors: req.session.user.errors })
  }
}
