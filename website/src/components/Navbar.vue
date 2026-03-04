<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

function changeRoute(routeName: string) {
    router.push("/" + routeName);
}
</script>

<template>
    <div id="navbar" class="bg-grey-darken-4">
        <div class="navbarLink" @click="changeRoute('')" :style="{ textDecoration: router.currentRoute.value.name == 'home' ? 'underline' : 'none' }">Your Notes</div>
        <div class="navbarLink" @click="changeRoute('settings')" :style="{ textDecoration: router.currentRoute.value.name == 'settings' ? 'underline' : 'none' }">Settings</div>
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
}

.navbarLink {
    color: white;
    font-size: 125%;
    cursor: pointer;
}
</style>
