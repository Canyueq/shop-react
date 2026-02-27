import { createSSRApp } from "vue";
import App from "./App.vue";
import Footer from "./components/Layout/Footer.vue";

export function createApp() {
  const app = createSSRApp(App);
  app.component("Footer", Footer);
  return {
    app,
  };
}
