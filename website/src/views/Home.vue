<script setup lang="ts">
import NotesDisplay from "../components/NotesDisplay.vue";
import CreateNote from "../components/CreateNote.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { apiUri } from "../exports";
const router = useRouter();
const emit = defineEmits<{
    logout: [null];
}>();

let createNote = ref<boolean>(false);
let updateNotes = ref<number>(0);

function noteCreated(wasCreated: boolean) {
    createNote.value = false;

    if (wasCreated == true) {
        updateNotes.value++;
    }
}

async function logout() {
    const data = await fetch(`${apiUri}/logout`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: localStorage.getItem("refreshToken"),
        }),
    });

    if (await data.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        emit("logout", null);
        router.push("/login");
    }
}
</script>

<template>
    <CreateNote
        v-if="createNote === true"
        @close="
            (wasCreated: boolean) => {
                noteCreated(wasCreated);
            }
        " />
    <div id="controls" class="bg-white">
        <v-btn color="warning" @click="logout()">Log out</v-btn>
        <v-btn color="success" @click="createNote = true">Create New Note</v-btn>
    </div>
    <NotesDisplay :updateNotes="updateNotes" />
</template>

<style scoped>
#controls {
    display: flex;
    flex-direction: row-reverse;
    margin: 0 0 20px 0;
    padding: 20px;
    width: 100%;
}
</style>
