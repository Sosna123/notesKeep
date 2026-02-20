<script setup lang="ts">
import YesNoModal from "@/components/reusable/YesNoModal.vue";
import ColorPicker from "@/components/reusable/ColorPicker.vue";
import { apiUri, type Note } from "@/exports";
import { ref } from "vue";
const props = defineProps<{
    note: Note;
}>();
const emit = defineEmits<{
    close: [boolean];
}>();

function formatDate(timestamp: number | null): string {
    if (timestamp == null) return "Unknown date";

    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

async function updateNote() {
    currModified.value = Number(new Date());
    props.note.dateOfLastChange = currModified.value;

    const data = await fetch(`${apiUri}/notes/modify`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(props.note),
    });

    if (!data.ok) {
        console.error("Failed to update note");
    }
}

async function deleteNote() {
    const data = await fetch(`${apiUri}/notes/delete`, {
        method: "delete",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(props.note),
    });

    if (data.ok) {
        emit("close", true);
    }
}

let currModified = ref<number>(props.note?.dateOfLastChange ?? 0);
function close() {
    currModified.value = 0;
    emit("close", false);
}
</script>

<template>
    <div id="currNoteContainer">
        <v-card v-if="props.note != null" :color="props.note.color ?? 'dark'">
            <template v-slot:title id="titleSlot">
                <div>
                    <div>
                        <v-textarea v-model="props.note.title" rows="1" no-resize @change="updateNote()"></v-textarea>
                    </div>
                    <div>
                        Created: {{ formatDate(props.note.dateOfCreation) }} <br />
                        Modified: {{ formatDate(currModified) }}
                    </div>
                </div>
                <v-divider></v-divider>
            </template>
            <template v-slot:text>
                <v-textarea v-model="props.note.content" max-rows="18" rows="18" auto-grow @change="updateNote()"></v-textarea>
            </template>
            <template v-slot:actions>
                <div>
                    <div>
                        <v-btn @click="close()" class="bg-success"><v-icon size="x-large" icon="mdi-check"></v-icon></v-btn>
                    </div>
                    <div>
                        <YesNoModal message="Do you want to delete this note?" iconBtn="mdi-trash-can" colorBtn="bg-error" :colorBg="note.color!" @deleteNote="deleteNote()" />
                        <ColorPicker :note="note" />
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
    width: 60%;
    height: 80%;
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

.v-card-title > div > div:nth-child(1) {
    text-align: right;
    font-size: 125%;
}

.v-card-title > div > div:nth-child(2) {
    text-align: right;
    font-size: 75%;
}
</style>
