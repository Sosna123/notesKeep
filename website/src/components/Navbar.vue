<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const loggedIn = ref<boolean>(false);

function changeRoute(routeName: string) {
    router.push("/" + routeName);
}

onMounted(() => {
    if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")) {
        loggedIn.value = true;
    }
});

router.afterEach(() => {
    if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")) {
        loggedIn.value = true;
    } else {
        loggedIn.value = false;
    }
});
</script>

<template>
    <div id="navbar" class="bg-grey-darken-4">
        <div v-show="loggedIn" class="navbarLink" @click="changeRoute('')" :style="{ textDecoration: router.currentRoute.value.name == 'home' ? 'underline' : 'none' }">Your Notes</div>
        <div v-show="loggedIn" class="navbarLink" @click="changeRoute('settings')" :style="{ textDecoration: router.currentRoute.value.name == 'settings' ? 'underline' : 'none' }">Settings</div>
    </div>
</template>

<style scoped>
#navbar {
    display: flex;
    flex-direction: row;
    margin: 0 0 20px 0;
    padding: 20px;
    width: 100%;
    justify-content: flex-start;
    gap: 20px;
    height: 70px;
}

.navbarLink {
    color: white;
    font-size: 125%;
    cursor: pointer;
}
</style>
