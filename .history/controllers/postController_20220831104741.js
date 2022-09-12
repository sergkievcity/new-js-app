const Post = require("../models/postModel")

exports.viewCreateScreen = function (req, res) {
  res.render("create-post")
}

exports.create = function (req, res) {
  let post = new Post(req.body)
  console.log(req.body)
  post
    .create()
    .then(function () {
      res.send("New post created")
    })
    .catch(function (errors) {
      res.send(errors)
    })
}
