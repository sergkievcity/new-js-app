let User = function () {
  this.homePlanet = "earth"
}

User.prototype.jump = function () {
  console.log("Jump")
}

module.exports = User
