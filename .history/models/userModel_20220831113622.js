const bcrypt = require("bcryptjs")
const validator = require("validator")
const usersCollection = require("../db").db("ComplexApp").collection("users")
const md5 = require("md5")
let User = function (data) {
  this.data = data
  this.errors = []
}

User.prototype.logCleanUp = function () {
  if (typeof (this.data.username != "string")) this.data.username == ""
  if (typeof (this.data.password != "string")) this.data.password == ""
  // get rid of any bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    password: this.data.password
  }
}

User.prototype.regCleanUp = function () {
  if (typeof (this.data.username != "string")) this.data.username == ""
  if (typeof (this.data.email != "string")) this.data.email == ""
  if (typeof (this.data.password != "string")) this.data.password == ""

  // get rid of any bogus properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  }
}

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.username == "") this.errors.push("You must provide a username")
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) this.errors.push("Username can only contain letters and numbers")
    if (!validator.isEmail(this.data.email)) this.errors.push("You must provide a valid email")
    if (this.data.password == "") this.errors.push("You must provide a password")
    if (this.data.password.length > 0 && this.data.password.length < 12) this.errors.push("Password must be at least 12 characters")
    if (this.data.password.length > 50) this.errors.push("Password can not exceed 50 characters")
    if (this.data.username.length > 0 && this.data.username.length < 3) this.errors.push("Username must be at least 3 characters")
    if (this.data.username.length > 30) this.errors.push("Username can not exceed 30 characters")

    //only if username is valid then check to seee if its already taken
    if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
      let usernameExists = await usersCollection.findOne({ username: this.data.username })
      if (usernameExists) this.errors.push("That username is already taken.")
    }

    //only if email is valid then check to seee if it's already taken
    if (validator.isEmail(this.data.email)) {
      let emailExists = await usersCollection.findOne({ email: this.data.email })
      if (emailExists) this.errors.push("That email is already being taken.")
    }

    resolve()
  })
}

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.logCleanUp()
    usersCollection
      .findOne({ username: this.data.username })
      .then(user => {
        if (user && bcrypt.compareSync(this.data.password, user.password)) {
          this.getAvatar(user.email)
          this._id = user._id
          resolve("Congrats")
        } else {
          reject("invalid username / password")
        }
      })
      .catch(function () {
        reject("Please try again later.")
      })
  })
}

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    // Step #1: Validate user data
    this.regCleanUp()
    await this.validate()

    // Step #2: Only if there are no validation errors
    // then save the user data into a database
    if (!this.errors.length) {
      // hash user password
      let salt = bcrypt.genSaltSync(10)
      this.data.password = bcrypt.hashSync(this.data.password, salt)

      await usersCollection.insertOne(this.data)
      this.getAvatar(this.data.email)
      resolve()
    } else {
      reject(this.errors)
    }
  })
}

User.prototype.getAvatar = function (email) {
  this.avatar = `https://gravatar.com/avatar/${md5(email)}?s=128`
  //this.avatar = `https://gravatar.com/avatar/f64fc44c03a8a7eb1d52502950879659?s=128`
}

module.exports = User
