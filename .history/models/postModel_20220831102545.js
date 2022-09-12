let Post = function (data) {
  this.data = data
  this.errors = []
}

Post.prototype.cleanUp = function () {
  if (typeof (this.data.title != "string")) this.data.title = ""
  if (typeof (this.data.body != "string")) this.data.body = ""

  // get rid of any bogus properties
  this.data = {
    title: this.data.title,
    body: this.data.body
  }
}

Post.prototype.validate = function () {}

Post.prototype.create = function () {}

module.exports = Post
