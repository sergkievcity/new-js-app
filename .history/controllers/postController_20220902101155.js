const Post = require("../models/postModel")

exports.viewCreateScreen = function (req, res) {
  res.render("create-post")
}

exports.create = function (req, res) {
  let post = new Post(req.body, req.session.user._id)
  post
    .create()
    .then(function () {
      res.send("New post created")
    })
    .catch(function (errors) {
      res.send(errors)
    })
}

exports.viewSingle = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id, req.visitorId)
    res.render("post", { post })
  } catch {
    res.render("404")
  }
}

exports.viewEditScreen = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id, req.visitorId)
    if (post.authorId == req.visitorId) {
      res.render("edit-post", { post })
    } else {
      req.flash("errors", "You do not have permission to perform this action")
      req.session.save(function () {
        res.redirect("/")
      })
    }
    //console.log(post)
  } catch {
    res.render("404")
  }
}

exports.edit = function (req, res) {
  let post = new Post(req.body, req.visitorId, req.params.id)
  post
    .update()
    .then(status => {
      // the post was sucessfully updated in the database
      // or user did have permission, but there were validations errors
      if (status == "success") {
        // post was updated in db
        req.flash("success", "Post successfully updated")
        req.session.save(function () {
          res.redirect(`/post/${req.params.id}/edit`)
        })
      } else {
        post.errors.forEach(function () {
          req.flash("errors", error)
        })
        req.session.save(function () {
          res.redirect(`/post/${req.params.id}/edit`)
        })
      }
    })
    .catch(() => {
      // a post with the requested id  doesn't exists
      // or if the current visitor is not the owner of the requested post
      req.flash("errors", "You do not have permission to perform this action")
      req.session.save(function () {
        res.redirect("/")
      })
    })
}
