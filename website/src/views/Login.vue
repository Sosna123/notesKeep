<script setup lang="ts">
import { useRouter } from "vue-router";
import LoginForm from "../components/Login/LoginForm.vue";
import SignUpForm from "../components/Login/SignUpForm.vue";
const router = useRouter();
const emit = defineEmits<{
    loggedIn: [null];
}>();

if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")) {
    router.replace("/");
}

function changeRoute() {
    if (router.currentRoute.value.name == "loginForm") {
        router.replace("/signup");
    }
    if (router.currentRoute.value.name == "signUpForm") {
        router.replace("/login");
    }
}
</script>

<template>
    <div id="form">
        <LoginForm v-if="router.currentRoute.value.name == 'loginForm'" @loggedIn="emit('loggedIn', null)" />
        <SignUpForm v-else-if="router.currentRoute.value.name == 'signUpForm'" @loggedIn="emit('loggedIn', null)" />
        <v-btn text @click="changeRoute()">
            {{ router.currentRoute.value.name == "loginForm" ? "Don't have an account? Sign Up" : "Already have an account? Login" }}
        </v-btn>
    </div>
</template>

<style scoped>
#form {
    margin: auto;
    width: 1000px;
    height: 1000px;
    text-align: center;
}
</style>
