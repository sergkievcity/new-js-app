const usersCollection = require("../db").db("ComplexApp").collection("users")
const followsCollection = require("../db").db("ComplexApp").collection("follows")
const ObjectID = require("mongodb").ObjectId
const user = require("./userModel")

let Follow = function (followedUsername, followerId) {
  this.followedUsername = followedUsername
  this.followerId = followerId
  this.errors = []
}

Follow.prototype.cleanUp = function () {
  if (typeof this.followedUsername != "string") {
    this.followedUsername = ""
  }
}

Follow.prototype.validate = async function (action) {
  //followed username must exist in database
  let followedAccount = await usersCollection.findOne({ username: this.followedUsername })
  if (followedAccount) {
    this.followedId = followedAccount._id
  } else {
    this.errors.push("You cannot follow a user that does not exist")
  }

  let doesFollowAlreadyExists = await followsCollection.findOne({ followedId: this.followedId, followerId: new ObjectID(this.followerId) })
  if (action == "create") {
    if (doesFollowAlreadyExists) {
      this.errors.push("You are already following this user")
    }
  }
  if (action == "delete") {
    if (!doesFollowAlreadyExists) {
      this.errors.push("You are not already following this user")
    }
  }

  // should
  if (this.followedId.equals(this.followerId)) {
    this.errors.push("You can not follow youself")
  }
}

Follow.prototype.create = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp()
    await this.validate("create")
    if (!this.errors.length) {
      await followsCollection.insertOne({ followedId: this.followedId, followerId: new ObjectID(this.followerId) })
      resolve()
    } else {
      reject(this.errors)
    }
  })
}

Follow.prototype.delete = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp()
    await this.validate("delete")
    if (!this.errors.length) {
      await followsCollection.deleteOne({ followedId: this.followedId, followerId: new ObjectID(this.followerId) })
      resolve()
    } else {
      reject(this.errors)
    }
  })
}

Follow.isVisitorFollowing = async function (followedId, visitorId) {
  let followDoc = await followsCollection.findOne({ followedId: followedId, followerId: new ObjectID(visitorId) })
  if (followDoc) {
    return true
  } else {
    return false
  }
}

Follow.getFollowersById = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let followers = await followsCollection.aggregate([{ $match: { followedId: id } }, { $lookup: { from: "users", localField: "followerId", foreignField: "_id", as: "userDoc" } }, { $project: { username: { $arrayElemAt: ["$userDoc.username", 0] }, email: { $arrayElemAt: ["$userDoc.email", 0] } } }]).toArray()
      console.log(followers)
      followers = followers.map(function (follower) {
        // create a user
        let user = new User(follower, true)
        return { username: follower.username, avatar: user.avatar }
      })
      resolve(followers)
    } catch {
      reject()
    }
  })
}

module.exports = Follow