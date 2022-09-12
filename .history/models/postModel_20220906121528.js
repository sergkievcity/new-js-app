const postsCollection = require("../db").db("ComplexApp").collection("posts")
const ObjectID = require("mongodb").ObjectId
const User = require("./userModel")
const sanitizeHTML = require("sanitize-html")

let Post = function (data, userid, requestedPostId) {
  this.data = data
  this.errors = []
  this.userid = userid
  this.requestedPostId = requestedPostId
}

Post.prototype.cleanUp = function () {
  if (typeof this.data.title != "string") this.data.title = ""
  if (typeof this.data.body != "string") this.data.body = ""

  // get rid of any bogus properties
  this.data = {
    title: sanitizeHTML(this.data.title.trim(), { allowedTags: [], allowedAttributes: {} }),
    body: sanitizeHTML(this.data.body.trim(), { allowedTags: [], allowedAttributes: {} }),
    createdDate: new Date(),
    author: ObjectID(this.userid)
  }
  console.log(this.userid)
}

Post.prototype.validate = function () {
  if (this.data.title == "") this.errors.push("You must provide a title")
  if (this.data.body == "") this.errors.push("You must provide a username")
}

Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    this.validate()
    if (!this.errors.length) {
      // save post into database
      postsCollection
        .insertOne(this.data)
        .then(info => {
          resolve(info.insertedId)
        })
        .catch(() => {
          this.errors.push("Please try again later")
          reject(this.errors)
        })
    } else {
      reject(this.errors)
    }
  })
}

Post.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let post = await Post.findSingleById(this.requestedPostId, this.userid)
      if (post.isVisitorOwner) {
        // update db
        let status = await this.actuallyUpdate()
        resolve(status)
      } else {
        reject()
      }
    } catch {
      reject()
    }
  })
}

Post.prototype.actuallyUpdate = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp()
    this.validate()
    if (!this.errors.length) {
      await postsCollection.findOneAndUpdate({ _id: new ObjectID(this.requestedPostId) }, { $set: { title: this.data.title, body: this.data.body } })
      resolve("success")
    } else {
      resolve("failure")
    }
  })
}

Post.reusablePostQuery = function (uniqueOperations, visitorId, finalOperations = []) {
  return new Promise(async function (resolve, reject) {
    let aggOperations = uniqueOperations.concat([{ $lookup: { from: "users", localField: "author", foreignField: "_id", as: "authorDocument" } }, { $project: { title: 1, body: 1, createdDate: 1, authorId: "$author", author: { $arrayElemAt: ["$authorDocument", 0] } } }]).concat(finalOperations)
    let posts = await postsCollection.aggregate(aggOperations).toArray()

    posts = posts.map(function (post) {
      post.isVisitorOwner = post.authorId.equals(visitorId)
      post.authorId = undefined
      post.author = {
        username: post.author.username,
        avatar: new User(post.author, true).avatar
      }
      return post
    })
    resolve(posts)
  })
}

Post.findSingleById = function (id, visitorId) {
  return new Promise(async function (resolve, reject) {
    if (typeof id != "string" || !ObjectID.isValid(id)) {
      reject()
      return
    }
    let posts = await Post.reusablePostQuery([{ $match: { _id: new ObjectID(id) } }], visitorId)

    if (posts.length) {
      resolve(posts[0])
    } else {
      reject()
    }
  })
}

Post.delete = function (postid, visitorId) {
  return new Promise(async (resolve, reject) => {
    try {
      let post = await Post.findSingleById(postid, visitorId)
      if (post.isVisitorOwner) {
        await postsCollection.deleteOne({ _id: new ObjectID(postid) })
        resolve()
      } else {
        reject()
      }
    } catch {
      reject()
    }
  })
}

Post.findByAuthorId = function (id) {
  return Post.reusablePostQuery([{ $match: { author: id } }, { $sort: { createdDate: -1 } }])
}

Post.search = function (term) {
  return new Promise(async (resolve, reject) => {
    if (typeof term == "string") {
      let posts = await Post.reusablePostQuery([{ $match: { $text: { $search: term } } }], undefined, [{ $sort: { score: { $meta: "textScore" } } }])
      resolve(posts)
    } else {
      reject()
    }
  })
}

module.exports = Post
