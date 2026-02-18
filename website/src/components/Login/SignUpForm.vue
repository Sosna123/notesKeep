<script setup lang="ts">
import { ref } from "vue";
import { apiUri } from "../../exports";
import { useRouter } from "vue-router";
import ErrorDisplay from "../reusable/ErrorDisplay.vue";
const router = useRouter();
const emit = defineEmits<{
    loggedIn: [null];
}>();

let currErrorMessage = ref<string>("");
let showError = ref<boolean>(false);

let formValues = ref<{ email: string; username: string; password: string; password2: string }>({ email: "", username: "", password: "", password2: "" });

async function submitForm() {
    if (formValues.value.email == "" || formValues.value.username == "" || formValues.value.password == "" || formValues.value.password2 == "") {
        currErrorMessage.value = "Empty fields";
        showError.value = true;
        return -1;
    } else if (formValues.value.password != formValues.value.password2) {
        currErrorMessage.value = "Passwords don't match";
        showError.value = true;
        return -1;
    } // length < 8 and contains numbers, lowercase letters, uppercase letters
    else if (formValues.value.password.length < 8 || formValues.value.password.match(/\d/g) == null || formValues.value.password.match(/[a-z]/g) === null || formValues.value.password.match(/[A-Z]/g) === null) {
        currErrorMessage.value = "Passwords must be 8 characters or longer, contain numbers, lowercase and uppercase letters";
        showError.value = true;
        return -1;
    }

    const data = await fetch(`${apiUri}/user/create`, {
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
        emit("loggedIn", null);
    } else {
        console.log("Singing up failed:", result);
    }
}
</script>

<template>
    <v-form>
        <v-text-field label="Email" required v-model="formValues.email"></v-text-field>
        <v-text-field label="Username" required v-model="formValues.username"></v-text-field>
        <v-text-field label="Password" type="password" required v-model="formValues.password"></v-text-field>
        <v-text-field label="Repeat password" type="password" required v-model="formValues.password2"></v-text-field>
        <v-btn color="primary" @click="submitForm()">Sign up</v-btn>
    </v-form>

    <ErrorDisplay v-show="showError" :message="currErrorMessage" @close="showError = false" />
</template>

<style scoped></style>
