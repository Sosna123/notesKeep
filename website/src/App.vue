<script setup lang="ts">
import { useRouter } from "vue-router";
import { apiUri } from "./exports";
const router = useRouter();

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

if ((!localStorage.getItem("accessToken") || !localStorage.getItem("refreshToken")) && router.currentRoute.value.path != "/login") {
    router.push("/login");
}
if (localStorage.getItem("accessToken") || localStorage.getItem("refreshToken")) {
    refreshToken();
}
</script>

<template>
    <router-view />
</template>

<style scoped></style>
