const dotenv = require("dotenv")
dotenv.config()
const { MongoClient, ObjectId } = require("mongodb")

const client = new MongoClient(process.env.CONNECTIONSTRING)

async function go() {
  try {
    await client.connect()
    module.exports = client.db("ComplexApp")
    const app = require("./app")
    app.listen(process.env.PORT)
  } catch (err) {
    console.log(err)
  }
}

go()
