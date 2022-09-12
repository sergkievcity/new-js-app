const usersCollection = require("../db").db("ComplexApp").collection("users")
const followsCollection = require("../db").db("ComplexApp").collection("follows")
const ObjectID = require("mongodb").ObjectId

let Follow = function (followedUsername, followerId) {
  this.followedUsername = followedUsername
  this.followerId = followerId
  this.errors = []
}

Follow.prototype.cleanUp = function () {
  if (typeof (this.followedUsername != "string")) {
    this.followedUsername = ""
  }
}

Follow.prototype.validate = async function () {
  //followed username must exist in database
  console.log(this.followedUsername)
  let followedAccount = await usersCollection.findOne({ username: this.followedUsername })
  if (followedAccount) {
    this.followedId = followedAccount._id
  } else {
    this.errors.push("You cannot follow a user that does not exist")
  }
}

Follow.prototype.create = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp()
    await this.validate()
    if (!this.errors.length) {
      await followsCollection.insertOne({ followedId: this.followedId, followerId: new ObjectID(this.followerId) })
      resolve()
    } else {
      reject(this.errors)
    }
  })
}

module.exports = Follow
