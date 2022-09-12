const { response } = require("../app")
const User = require("../models/userModel")
const Post = require("../models/postModel")
const Follow = require("../models/followModel")

exports.register = function (req, res) {
  let user = new User(req.body)
  user
    .register()
    .then(() => {
      req.session.user = { username: user.data.username, avatar: user.avatar, _id: user.data._id }
      //console.log(req.session.user)
      req.session.save(function () {
        res.redirect("/")
      })
    })
    .catch(regErrors => {
      regErrors.forEach(function (error) {
        req.flash("regErrors", error)
      })
      req.session.save(function () {
        res.redirect("/")
      })
    })
}

exports.login = function (req, res) {
  let user = new User(req.body)
  user
    .login()
    .then(function (result) {
      req.session.user = { avatar: user.avatar, username: user.data.username, _id: user._id }
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
    res.render("home-dashboard")
  } else {
    res.render("home-guest", { regErrors: req.flash("regErrors") })
  }
}

exports.mustBeLoggedIn = function (req, res, next) {
  if (req.session.user) {
    next()
  } else {
    req.flash("errors", "You must be logged in to perform that action")
    req.session.save(function () {
      res.redirect("/")
    })
  }
}

exports.ifUserExists = function (req, res, next) {
  User.findByUsername(req.params.username)
    .then(function (userDocument) {
      req.profileUser = userDocument
      next()
    })
    .catch(function () {
      res.render("404")
    })
}

exports.profilePostsScreen = function (req, res) {
  // ask post model for posts by certain author id
  Post.findByAuthorId(req.profileUser._id)
    .then(function (posts) {
      res.render("profile", {
        profileUsername: req.profileUser.username,
        profileAvatar: req.profileUser.avatar,
        posts: posts,
        isFollowing: req.isFollowing,
        isVisitorsProfile: req.isVisitorsProfile
      })
    })
    .catch(function () {
      res.render("404")
    })
}

exports.sharedProfileData = async function (req, res, next) {
  let isVisitorsProfile = false
  let isFollowing = false
  if (req.session.user) {
    isVisitorsProfile = req.profileUser._id.equals(req.session.user._id)
    isFollowing = await Follow.isVisitorFollowing(req.profileUser._id, req.visitorId)
  }
  req.isVisitorsProfile = isVisitorsProfile
  req.isFollowing = isFollowing
  next()
}

exports.profileFollowersScreen = async function (req, res) {
  try {
    let followers = await Follow.getFollowersById(req.profileUser._id)

    res.render("profile-followers", {
      profileUsername: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      followers: followers,
      isFollowing: req.isFollowing,
      isVisitorsProfile: req.isVisitorsProfile
    })
  } catch {
    res.render("404")
  }
}
