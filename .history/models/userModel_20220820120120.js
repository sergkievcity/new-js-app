let User = function (data) {
  this.data = data
}

User.prototype.register = function () {
  // Step #1: Validate user data

  // Step #2: Only if there are no validation errors
  console.log(this.data.email)
}

module.exports = User
