<script setup lang="ts">
import { apiUri, type Note } from "@/exports";
import { ref } from "vue";
import ColorPicker from "@/components/reusable/ColorPicker.vue";
const emit = defineEmits<{
    close: [boolean];
}>();

let newNote = ref<Note>({
    id: -1,
    user_id: -1,
    title: "",
    content: "",
    dateOfCreation: -1,
    dateOfLastChange: -1,
    color: "#070707",
});

async function addNote() {
    if (newNote.value.title == "" || newNote.value.content == "") {
        return;
    }

    const data = await fetch(`${apiUri}/notes/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
            title: newNote.value.title,
            content: newNote.value.content,
            color: newNote.value.color,
        }),
    });

    emit("close", true);
    if (!data.ok) {
        console.error("Failed to add note");
    }
}

function close() {
    emit("close", false);
}
</script>

<template>
    <div id="currNoteContainer">
        <v-card v-if="newNote != null" :color="newNote.color ?? 'dark'">
            <template v-slot:title id="titleSlot">
                <div>
                    <v-textarea v-model="newNote.title" placeholder="Title" rows="1" no-resize></v-textarea>
                </div>
                <v-divider></v-divider>
            </template>
            <template v-slot:text>
                <v-textarea v-model="newNote.content" placeholder="Content" max-rows="25" auto-grow></v-textarea>
            </template>
            <template v-slot:actions>
                <div>
                    <div>
                        <v-btn class="bg-success" @click="addNote()"><v-icon size="x-large" icon="mdi-check"></v-icon></v-btn>
                        <v-btn class="bg-error" @click="close()"><v-icon size="x-large" icon="mdi-close"></v-icon></v-btn>
                    </div>
                    <div>
                        <ColorPicker :note="newNote" />
                    </div>
                </div>
            </template>
        </v-card>
    </div>
</template>

<style scoped>
#currNoteContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
}

#currNoteContainer > div.v-card {
    width: 100%;
}

.v-card-title > div {
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
}

.v-card-actions > div {
    display: flex;
    flex-direction: row;
    padding-left: 15px;
    width: 100%;
    padding: 0 10px;
    justify-content: space-between;
}

.v-card-actions > div > div {
    display: flex;
    flex-direction: row;
    gap: 15px;
    padding-left: 15px;
    margin: 0;
    padding: 0;
}
</style>
