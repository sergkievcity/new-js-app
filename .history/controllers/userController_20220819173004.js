const express = require("express")

exports.login = function () {}

exports.logout = function () {}

exports.register = function () {}

exports.home = function (req, res) {
  res.view("home-guest")
}
