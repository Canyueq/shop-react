import { createSSRApp } from "vue";
import App from "./App.vue";
import Footer from "./components/Layout/Footer.vue";
import { createPinia } from "pinia";

export function createApp() {
  const pinia = createPinia();
  const app = createSSRApp(App);
  app.use(pinia);
  app.component("Footer", Footer);
  return {
    app,
  };
}
