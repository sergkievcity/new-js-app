let User = function (data) {
  this.data = data
}

User.prototype.register = function () {
  console.log("Jump")
}

module.exports = User
