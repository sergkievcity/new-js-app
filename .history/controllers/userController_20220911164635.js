const { response } = require("../app")
const User = require("../models/userModel")
const Post = require("../models/postModel")
const Follow = require("../models/followModel")
const jwt = require("jsonwebtoken")

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

exports.apiLogin = function (req, res) {
  let user = new User(req.body)
  user
    .login()
    .then(function (result) {
      res.json(jwt.sign({ _id: user.data._id }, process.env.JWTSECRET, { expiresIn: "30m" }))
      console.log(user.data._id)
    })
    .catch(function (error) {
      res.json("Sorry")
    })
}

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect("/")
  })
}

exports.home = async function (req, res) {
  if (req.session.user) {
    //fetch feed of posts for current user
    let posts = await Post.getFeed(req.session.user._id)
    res.render("home-dashboard", { posts })
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

exports.apiMustBeLoggedIn = function (req, res, next) {
  try {
    req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET)
    next()
  } catch {
    res.json("Sorry, you must provide a valid token")
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
        currentPage: "posts",
        profileUsername: req.profileUser.username,
        profileAvatar: req.profileUser.avatar,
        posts: posts,
        isFollowing: req.isFollowing,
        isVisitorsProfile: req.isVisitorsProfile,
        counts: { postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount },
        title: `Profile for ${req.profileUser.username}`
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
  //retrieve post, follower and following counts
  let postCountPromise = Post.countPostsById(req.profileUser._id)
  let followerCountPromise = Follow.countFollowersById(req.profileUser._id)
  let followingCountPromise = Follow.countFollowingById(req.profileUser._id)

  let [postCount, followerCount, followingCount] = await Promise.all([postCountPromise, followerCountPromise, followingCountPromise])
  req.postCount = postCount
  req.followerCount = followerCount
  req.followingCount = followingCount

  next()
}

exports.profileFollowersScreen = async function (req, res) {
  try {
    let followers = await Follow.getFollowersById(req.profileUser._id)

    res.render("profile-followers", {
      currentPage: "followers",
      profileUsername: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      followers: followers,
      isFollowing: req.isFollowing,
      isVisitorsProfile: req.isVisitorsProfile,
      counts: { postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount }
    })
  } catch {
    res.render("404")
  }
}

exports.profileFollowingScreen = async function (req, res) {
  try {
    let following = await Follow.getFollowingById(req.profileUser._id)

    res.render("profile-following", {
      currentPage: "following",
      profileUsername: req.profileUser.username,
      profileAvatar: req.profileUser.avatar,
      following: following,
      isFollowing: req.isFollowing,
      isVisitorsProfile: req.isVisitorsProfile,
      counts: { postCount: req.postCount, followerCount: req.followerCount, followingCount: req.followingCount }
    })
  } catch {
    res.render("404")
  }
}

exports.doesUsernameExist = function (req, res) {
  User.findByUsername(req.body.username)
    .then(() => {
      res.json(true)
    })
    .catch(() => {
      res.json(false)
    })
}

exports.doesEmailExist = async function (req, res) {
  let emailBool = await User.doesEmailExist(req.body.email)
  res.json(emailBool)
}
