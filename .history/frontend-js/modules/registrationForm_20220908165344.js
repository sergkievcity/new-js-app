export default class registrationForm {
  constructor() {
    this.allFields = document.querySelectorAll("#registration-form .form-control")
    this.insertValidationElements()
    events()
  }
  // Events
  events() {
    alert(1)
  }
  // Methods
  insertValidationElements() {
    this.allFields.forEach(function (el) {
      el.insertAdjacentHTML("afterend", '<div class="alert alerty-danger small liveValidateMessage liveValidateMessage--visible"></div>')
    })
  }
}
