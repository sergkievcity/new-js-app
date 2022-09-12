let User = function (data) {
  this.data = data
}

User.prototype.jump = function () {
  console.log("Jump")
}

module.exports = User
