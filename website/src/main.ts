import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createWebHistory, createRouter } from "vue-router";

import NotesDisplay from "./views/NotesDisplay.vue";
import Settings from "./views/Settings.vue";
import Login from "./views/Login.vue";

const routes = [
    { path: "/", name: "home", component: NotesDisplay },
    { path: "/settings", name: "settings", component: Settings },
    { path: "/login", name: "loginForm", component: Login },
    { path: "/signup", name: "signUpForm", component: Login },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

import "vuetify/styles/main.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "dark",
    },
    icons: {
        defaultSet: "mdi",
        aliases,
        sets: {
            mdi,
        },
    },
});

createApp(App).use(router).use(vuetify).mount("#app");
