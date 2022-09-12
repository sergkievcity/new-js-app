export default class Chat {
  constructor() {
    this.chatWrapper = document.querySelector("#chat-wrapper")
    this.chatIcon = document.querySelector(".header-chat-icon")
    this.injectHTML()
    this.chatLog = document.querySelector("#chat")
    this.chatField = document.querySelector("#chatField")
    this.chatForm = document.querySelector("#chatForm")
    this.closeIcon = document.querySelector(".chat-title-bar-close")
    this.events()
    this.first = true
  }

  // Events
  events() {
    this.chatForm.addEventListener("submit", e => this.sendMessageToServer(e))
    this.chatIcon.addEventListener("click", () => this.openChat())
    this.closeIcon.addEventListener("click", () => this.closeChat())
  }

  // Methods
  injectHTML() {
    this.chatWrapper.innerHTML = `
    <div class="chat-title-bar">Chat <span class="chat-title-bar-close"><i class="fas fa-times-circle"></i></span></div>
    <div id="chat" class="chat-log"></div>
    <form id="chatForm" class="chat-form border-top">
      <input type="text" class="chat-field" id="chatField" placeholder="Type a message…" autocomplete="off">
    </form>
		`
  }

  openChat() {
    if (this.first) {
      this.openConnection()
    }
    this.chatWrapper.classList.add("chat--visible")
    this.first = false
    this.chatField.focus()
  }

  closeChat() {
    this.chatWrapper.classList.remove("chat--visible")
  }

  openConnection() {
    this.socket = io()
    this.socket.on("chatMessageFromServer", data => {
      this.displayMessageFromserver(data)
    })

    this.socket.on("welcome", data => {
      this.username = data.username
      this.avatar = data.avatar
    })
  }

  displayMessageFromserver(data) {
    this.chatLog.insertAdjacentHTML(
      "beforeend",
      `
			<div class="chat-other">
        <a href="#"><img class="avatar-tiny" src="${data.avatar}"></a>
        <div class="chat-message"><div class="chat-message-inner">
          <a href="#"><strong>${data.username}:</strong></a>
          ${data.message}
        </div></div>
      </div>
		`
    )
  }

  sendMessageToServer(e) {
    e.preventDefault()
    this.socket.emit("chatMessageFromBrowser", { message: this.chatField.value })
    this.chatLog.insertAdjacentHTML(
      "beforeend",
      `
		<div class="chat-self">
        <div class="chat-message">
          <div class="chat-message-inner">
            ${this.chatField.value}
          </div>
        </div>
        <img class="chat-avatar avatar-tiny" src="${this.avatar}">
      </div>
		`
    )
    this.chatLog.scrollTop = this.chatLog.scrollHeight
    this.chatField.value = ""
    this.chatField.focus()
  }
}
