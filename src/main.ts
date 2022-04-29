import { createApp } from "vue"
import App from "./App.vue"

const app = createApp(App)

// create dom
const element = document.createElement("div")
element.setAttribute("id", "app")
document.body.appendChild(element)

// store
import { createPinia } from "pinia"

// icon
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
library.add(faChevronLeft)
library.add(faChevronRight)

app.directive("focus", {
  mounted(el) {
    el.focus()
  },
})

// create vue app
app.component("Icon", FontAwesomeIcon)
app.use(createPinia())
app.mount("#app")
