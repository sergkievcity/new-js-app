import Search from "./modules/search"
import Chat from "./modules/chat"
import registrationForm from "./module/registrationForm"

if (document.querySelector(".header-search-icon")) {
  new Search()
}

if (document.querySelector("#chat-wrapper")) {
  new Chat()
}

if (document.querySelector("#registration-form")) {
  new registrationForm()
}
