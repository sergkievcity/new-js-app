export default class Chat {
  constructor() {
    this.chatWrapper = document.querySelector("#chat-wrapper")
    this.chatIcon = document.querySelector(".header-chat-icon")
    this.injectHTML()
    this.events()
  }

  // Events
  events() {
    this.chatIcon.addEventListener("click", this.openChat())
  }

  // Methods
  injectHTML() {
    this.chatWrapper.innerHTML = `
		<div id="chat-wrapper" class="chat-wrapper shadow border-top border-left border-right">
    <div class="chat-title-bar">Chat <span class="chat-title-bar-close"><i class="fas fa-times-circle"></i></span></div>
    <div id="chat" class="chat-log">
  
      <!-- template for your own message -->
      <div class="chat-self">
        <div class="chat-message">
          <div class="chat-message-inner">
            Hello, how are you?
          </div>
        </div>
        <img class="chat-avatar avatar-tiny" src="https://gravatar.com/avatar/f64fc44c03a8a7eb1d52502950879659?s=128">
      </div>
      <!-- end template-->
      
      <!-- template for messages from others -->
      <div class="chat-other">
        <a href="#"><img class="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"></a>
        <div class="chat-message"><div class="chat-message-inner">
          <a href="#"><strong>barksalot:</strong></a>
          I am doing well. How about you?
        </div></div>
      </div>
      <!-- end template-->
      
    </div>
    
    <form id="chatForm" class="chat-form border-top">
      <input type="text" class="chat-field" id="chatField" placeholder="Type a message…" autocomplete="off">
    </form>
  </div>
		`
  }

  openChat() {
    this.chatWrapper.classList.add("chat--visible")
  }
}
