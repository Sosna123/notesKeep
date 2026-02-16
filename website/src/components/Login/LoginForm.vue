<script setup lang="ts">
import { ref } from "vue";
import { apiUri } from "../../exports";
import { useRouter } from "vue-router";
const router = useRouter();
const emit = defineEmits({
    loggedIn: null,
});

let formValues = ref<{ email: string; password: string }>({ email: "", password: "" });

async function submitForm() {
    const data = await fetch(`${apiUri}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues.value),
    });
    const result = await data.json();
    if (data.ok) {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
        router.push("/");
        emit("loggedIn");
    } else {
        console.log("Login failed:", result);
    }
}
</script>

<template>
    <v-form>
        <v-text-field label="Email" required v-model="formValues.email"></v-text-field>
        <v-text-field label="Password" type="password" required v-model="formValues.password"></v-text-field>
        <v-btn color="primary" @click="submitForm()">Login</v-btn>
    </v-form>
</template>

<style scoped></style>
