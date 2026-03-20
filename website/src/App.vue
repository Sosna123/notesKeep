<script setup lang="ts">
import { useRouter } from "vue-router";
import { apiUri, errorDisplayInfo } from "@/exports";
import Navbar from "@/components/Navbar.vue";
import ErrorDisplay from "@/components/reusable/ErrorDisplay.vue";
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

router.beforeEach((to, _from, next) => {
    if (!localStorage.getItem("accessToken") && !localStorage.getItem("refreshToken")) {
        if (to.name != "loginForm" && to.name != "signUpForm") {
            next("/login");
        } else {
            next();
        }
    } else {
        next();
    }
});

if (localStorage.getItem("refreshToken")) {
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
    <div class="bg-grey-darken-3" style="min-height: 100vh">
        <Navbar />
        <div id="mainContentContainer">
            <router-view @loggedIn="setRefreshInterval()" @logout="clearRefreshInterval()" />
            <ErrorDisplay v-show="errorDisplayInfo.show" />
        </div>
    </div>
</template>

<style scoped>
#mainContentContainer {
    padding: 0 30px 30px 30px;
}
</style>
