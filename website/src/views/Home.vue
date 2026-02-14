<script setup lang="ts">
import NotesDisplay from "../components/NotesDisplay.vue";
import CreateNote from "../components/CreateNote.vue";
import { ref } from "vue";
let createNote = ref<boolean>(false);
let updateNotes = ref<number>(0);

function noteCreated(wasCreated: boolean) {
    createNote.value = false;

    if (wasCreated == true) {
        console.log(`UPDATENOTES ${updateNotes.value}`);
        updateNotes.value++;
        console.log(`UPDATENOTES ${updateNotes.value}`);
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
