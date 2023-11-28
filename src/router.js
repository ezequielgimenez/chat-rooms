"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@vaadin/router");
const router = new router_1.Router(document.querySelector(".root"));
router.setRoutes([
    { path: "/", component: "init-welcome" },
    { path: "/signIn", component: "init-page" },
    { path: "/chat", component: "chat-page" },
]);
