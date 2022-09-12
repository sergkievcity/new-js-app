exports.login = function () {}

exports.logout = function () {}

exports.register = function () {}

function home(req, res) {
  res.view("home-guest")
}

module.exports = {
  home
}
