<script setup lang="ts">
import { useRouter } from "vue-router";
import { apiUri } from "./exports";
const router = useRouter();
let refreshInterval: number | null = null;

async function refreshToken() {
    const data = await fetch(`${apiUri}/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: localStorage.getItem("refreshToken"),
        }),
    });

    if (data.ok) {
        const json = await data.json();
        localStorage.setItem("accessToken", json.accessToken);
    } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
}

if (((!localStorage.getItem("accessToken") || !localStorage.getItem("refreshToken")) && router.currentRoute.value.name == "loginForm") || router.currentRoute.value.name == "signUpForm") {
    router.push("/login");
}
if (localStorage.getItem("accessToken") || localStorage.getItem("refreshToken")) {
    refreshToken();
    setRefreshInterval();
}

function setRefreshInterval() {
    if (refreshInterval == null) {
        refreshInterval = setInterval(
            () => {
                refreshToken();
            },
            // 9 * 1000,
            29 * 60 * 1000,
        );
    }
}

function clearRefreshInterval() {
    if (refreshInterval != null) {
        clearInterval(refreshInterval);
    }
}
</script>

<template>
    <router-view @loggedIn="setRefreshInterval()" @logout="clearRefreshInterval()" />
</template>

<style scoped></style>
