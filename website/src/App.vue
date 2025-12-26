<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

if ((!localStorage.getItem("accessToken") || !localStorage.getItem("refreshToken")) && router.currentRoute.value.path != "/login") {
    router.push("/login");
}
</script>

<template>
    <router-view />
</template>

<style scoped></style>
