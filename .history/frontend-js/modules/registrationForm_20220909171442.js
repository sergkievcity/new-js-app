import axios from "axios"

export default class registrationForm {
  constructor() {
    this.allFields = document.querySelectorAll("#registration-form .form-control")
    this.insertValidationElements()
    this.username = document.querySelector("#username-register")
    this.username.previousValue = ""
    this.username.timer
    this.email = document.querySelector("#email-register")
    this.email.timer
    this.password = document.querySelector("#password-register")
    this.password.previousValue = ""
    this.password.timer

    this.events()
  }
  // Events
  events() {
    this.username.addEventListener("keyup", () => {
      this.isDifferent(this.username, this.emailHandler)
    })
    this.email.addEventListener("keyup", () => {
      this.isDifferent(this.email, this.emailHandler)
    })
    this.password.addEventListener("keyup", () => {
      this.isDifferent(this.password, this.passwordHandler)
    })
  }
  // Methods
  insertValidationElements() {
    this.allFields.forEach(function (el) {
      el.insertAdjacentHTML("afterend", '<div class="alert alert-danger small liveValidateMessage"></div>')
    })
  }

  isDifferent(el, handler) {
    if (el.previousValue != el.value) {
      handler.call(this)
    }
    el.previousValue = el.value
  }

  usernameHandler() {
    this.username.errors = false
    this.usernameImmediately()
    clearTimeout(this.username.timer)
    this.username.timer = setTimeout(() => this.usernameAfterDelay(), 800)
  }

  emailHandler() {
    this.email.errors = false
    clearTimeout(this.email.timer)
    this.email.timer = setTimeout(() => this.emailAfterDelay(), 800)
  }

  passwordHandler() {
    this.password.errors = false
    this.passwordImmediately()
    clearTimeout(this.password.timer)
    this.password.timer = setTimeout(() => this.passwordAfterDelay(), 800)
  }

  passwordAfterDelay() {
    if (this.password.value.length < 12) {
      this.showValidationError(this.password, "Password must be at least 12 characters")
    }
  }

  passwordImmediately() {
    if (this.password.value.length > 50) {
      this.showValidationError(this.password, "Password can not exceed 50 characters")
    }

    if (!this.password.errors) {
      this.hideValidationError(this.username)
    }
  }

  usernameImmediately() {
    if (this.username.value != "" && !/^([a-zA-Z0-9]+)$/.test(this.username.value)) {
      this.showValidationError(this.username, "Username can only contain letters and numbers")
    }
    if (this.username.value.length > 30) {
      this.showValidationError(this.username, "Username can not exceed 30 characters")
    }
    if (!this.username.errors) {
      this.hideValidationError(this.username)
    }
  }

  hideValidationError(el) {
    el.nextElementSibling.classList.remove("liveValidateMessage--visible")
  }

  showValidationError(el, message) {
    el.nextElementSibling.innerHTML = message
    el.nextElementSibling.classList.add("liveValidateMessage--visible")
    el.errors = true
  }

  usernameAfterDelay() {
    if (this.username.value.length < 3) {
      this.showValidationError(this.username, "Username must be at least 3 characters")
    }

    if (!this.username.errors) {
      axios
        .post("/doesUsernameExist", { username: this.username.value })
        .then(response => {
          if (response.data) {
            this.showValidationError(this.username, "That username is already taken")
            this.username.isUnique = false
          } else {
            this.username.isUnique = true
          }
        })
        .catch(() => {
          console.log("Please try again later")
        })
    }
  }

  emailAfterDelay() {
    if (!/^\S+@\S+$/.test(this.email.value)) {
      this.showValidationError(this.email, "You must provide a valid email")
    }

    if (!this.email.errors) {
      axios
        .post("/doesEmailExist", { email: this.email.value })
        .then(response => {
          if (response.data) {
            this.email.isUnique = false
            this.showValidationError(this.email, "That email is already being used")
          } else {
            this.email.isUnique = true
            this.hideValidationError(this.email)
          }
        })
        .catch(() => {
          console.log("Please try again later")
        })
    }
  }
}
