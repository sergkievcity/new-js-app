const Follow = require("../models/Follow")
exports.addFollow = function (req, res) {
  console.log(req.params)
  let follow = new Follow(req.params.username)
}
