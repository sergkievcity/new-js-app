const express = require("express")
const app = express()

app.set("views", "views")
app.set("view engine", "ejs")

app.get("/", function (req, res) {
  res.send("Wellcome our new app")
})

app.listen(3000)
