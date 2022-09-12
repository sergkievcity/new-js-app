const { MongoClient, ObjectId } = require("mongodb")
const client = new MongoClient("mongodb://localhost:27017/")

async function go() {
  try {
    await client.connect()
    module.exports = client.db("ComplexApp")
    const app = require("./app")
    app.listen(3000)
  } catch (err) {
    console.log(err)
  }
}
go()
