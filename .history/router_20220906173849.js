const express = require("express")
const router = express.Router()
const userController = require("./controllers/userController")
const postController = require("./controllers/postController")
const followController = require("./controllers/followController")

router.get("/", userController.home)

// user related routes
router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/logout", userController.logout)

// post related routes
router.get("/create-post", userController.mustBeLoggedIn, postController.viewCreateScreen)
router.post("/create-post", userController.mustBeLoggedIn, postController.create)
router.get("/post/:id", postController.viewSingle)
router.get("/post/:id/edit", userController.mustBeLoggedIn, postController.viewEditScreen)
router.post("/post/:id/edit", userController.mustBeLoggedIn, postController.edit)
router.post("/post/:id/delete", userController.mustBeLoggedIn, postController.delete)

// profile related routes
router.get("/profile/:username", userController.ifUserExists, userController.profilePostsScreen)
// search related routes
router.post("/search", postController.search)
// follow related routes
router.post("/addFollow/:username", followController.addFollow)

module.exports = router
