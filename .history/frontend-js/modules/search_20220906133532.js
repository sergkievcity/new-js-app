import axios from "axios"

export default class Search {
  // 1. Select dom elements and keep track of any useful data
  constructor() {
    this.injectHTML()
    this.headerSearchIcon = document.querySelector(".header-search-icon")
    this.searchOverlay = document.querySelector(".search-overlay")
    this.closeIcon = document.querySelector(".close-live-search")
    this.inputField = document.querySelector("#live-search-field")
    this.resultsArea = document.querySelector(".live-search-results")
    this.loaderIcon = document.querySelector(".circle-loader")
    this.previousValue = ""
    this.timer
    this.events()
  }
  // 2. Events
  events() {
    this.inputField.addEventListener("keyup", () => this.keyPressHandler())
    this.headerSearchIcon.addEventListener("click", e => {
      e.preventDefault()
      this.openOverlay()
    })
    this.closeIcon.addEventListener("click", e => {
      e.preventDefault()
      this.closeOverlay()
    })
  }

  // 3. Methods
  keyPressHandler() {
    let value = this.inputField.value

    if (value == "") {
      clearTimeout(this.timer)
      this.hideLoaderIcon()
      this.hideResultsArea()
    }

    if (value != "" && value != this.previousValue) {
      clearTimeout(this.timer)
      this.showLoaderIcon()
      this.hideResultsArea()
      this.timer = setTimeout(() => this.sendRequest(), 750)
    }

    this.previousValue = value
  }

  sendRequest() {
    axios
      .post("/search", { searchTerm: this.inputField.value })
      .then(response => {
        this.renderResultsHTML(response.data)
      })
      .catch(() => {
        alert("There was a problem")
      })
  }

  renderResultsHTML(posts) {
    if (posts.length) {
      this.resultsArea.innerHTML = `
			<div class="list-group shadow-sm">
            <div class="list-group-item active"><strong>Search Results</strong> (${posts.length} items found)</div>
						${posts
              .map(post => {
                return `<a href="/post/${post._id}" class="list-group-item list-group-item-action">
              <img class="avatar-tiny" src="${post.author.avatar}"> <strong>${post.title}</strong>
              <span class="text-muted small">by ${post.author.username} on ${post.createdDate.getMonth() + 1} / ${post.createdDate.getDate()} / ${post.createdDate.getFullYear()}</span>
            </a>`
              })
              .join("")}
          </div>`
      console.log(posts)
    } else {
      this.resultsArea.innerHTML = `<p class="alert alert-danger text-center shadow-sm">Sorry, we could not find any results for this search</p>`
    }
    this.hideLoaderIcon()
    this.showResultsArea()
  }

  showLoaderIcon() {
    this.loaderIcon.classList.add("circle-loader--visible")
  }

  hideLoaderIcon() {
    this.loaderIcon.classList.remove("circle-loader--visible")
  }

  showResultsArea() {
    this.resultsArea.classList.add("live-search-results--visible")
  }

  hideResultsArea() {
    this.resultsArea.classList.remove("live-search-results--visible")
  }

  openOverlay() {
    this.searchOverlay.classList.add("search-overlay--visible")
    setTimeout(() => this.inputField.focus(), 50)
  }
  closeOverlay() {
    this.searchOverlay.classList.remove("search-overlay--visible")
  }

  injectHTML() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="search-overlay">
    <div class="search-overlay-top shadow-sm">
      <div class="container container--narrow">
        <label for="live-search-field" class="search-overlay-icon"><i class="fas fa-search"></i></label>
        <input type="text" id="live-search-field" class="live-search-field" placeholder="What are you interested in?">
        <span class="close-live-search"><i class="fas fa-times-circle"></i></span>
      </div>
    </div>

    <div class="search-overlay-bottom">
      <div class="container container--narrow py-3">
        <div class="circle-loader"></div>
        <div class="live-search-results">
          
        </div>
      </div>
    </div>
  </div>`
    )
  }
}
