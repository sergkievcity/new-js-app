const Follow = require("../models/followModel")
exports.addFollow = function (req, res) {
  console.log(req.params)
  let follow = new Follow(req.params.username, req.visitorId)
  follow.create()
}
