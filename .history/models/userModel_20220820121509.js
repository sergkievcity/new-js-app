let User = function (data) {
  this.data = data
  this.errors = []
}

User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("You must provide a username")
  }
  if (this.data.email == "") {
    this.errors.push("You must provide a valid email")
  }
  if (this.data.password == "") {
    this.errors.push("You must provide a password")
  }
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("You must provide a password")
  }
}

User.prototype.register = function () {
  // Step #1: Validate user data
  this.validate()

  // Step #2: Only if there are no validation errors
  // then save the user data into a database
}

module.exports = User
