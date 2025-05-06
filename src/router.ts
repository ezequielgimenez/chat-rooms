import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "init-welcome" },
  { path: "/select-options", component: "select-page" },
  { path: "/signIn", component: "init-page" },
  { path: "/chat", component: "chat-page" },
]);
