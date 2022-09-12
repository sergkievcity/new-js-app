const Follow = require("../models/followModel")
exports.addFollow = function (req, res) {
  console.log(req.params)
  let follow = new Follow(req.params.username, req.visitorId)
  follow
    .create()
    .then(() => {
      req.flash("success", `Succesfully followed ${req.params.username}`)
      req.session.save(() => res.redirect(`/profile/${req.params.username}`))
    })
    .catch(errors => {
      errors.forEach(error => {
        req.flash("errors", error)
      })
    })
}
