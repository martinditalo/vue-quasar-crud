import { createApp } from "vue";
import { Quasar } from "quasar";
import { createPinia } from "pinia";
import App from "./App.vue";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

const myApp = createApp(App);

myApp.use(createPinia());
myApp.use(Quasar, {
  plugins: {}, 
});

myApp.mount("#app");
