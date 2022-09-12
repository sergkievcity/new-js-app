const express = require("express")
const app = express()

app.get("/", function (req, res) {
  res.send("Wellcome our new app")
})

app.listen(3000)
