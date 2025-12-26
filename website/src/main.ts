import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createWebHistory, createRouter } from "vue-router";

import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Note from "./views/Note.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/note/:id", component: Note },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

import "vuetify/styles/main.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "dark",
    },
});

createApp(App).use(router).use(vuetify).mount("#app");
