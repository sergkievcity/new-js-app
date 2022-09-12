export default class registrationForm {
  constructor() {
    this.allFields = document.querySelectorAll("#registration-form .form-control")
    this.insertValidationElements()
    this.username = document.querySelector("#username-register")
    this.username.previousValue = ""
  }
  // Events
  events() {
    this.username.addEventListener("keyup", () => {
      this.isDifferent(this.username, this.usernameHandler)
    })
  }
  // Methods
  insertValidationElements() {
    this.allFields.forEach(function (el) {
      el.insertAdjacentHTML("afterend", '<div class="alert alert-danger small liveValidateMessage liveValidateMessage--visible"></div>')
    })
  }

  isDifferent(el, handler) {
    if (el.previousValue != el.value) {
      handler.call(this)
    }
    el.previousValue = el.value
  }

  usernameHandler() {
    alert(1)
  }
}
