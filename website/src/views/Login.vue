<script setup lang="ts">
import LoginForm from "../components/Login/LoginForm.vue";
import SignUpForm from "../components/Login/SignUpForm.vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

let login = ref<boolean>(true);

if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")) {
    router.replace("/");
}
</script>

<template>
    <div id="form">
        <LoginForm v-if="login" />
        <SignUpForm v-else />
        <v-btn text @click="login = !login">
            {{ login ? "Don't have an account? Sign Up" : "Already have an account? Login" }}
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
