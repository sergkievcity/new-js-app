const express = require("express")
const session = require("express-session")
const app = express()

let sessionOptions = session({
  secret: "Secret text",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
})

const router = require("./router")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static("public"))
app.set("views", "views")
app.set("view engine", "ejs")

app.use("/", router)

module.exports = app
