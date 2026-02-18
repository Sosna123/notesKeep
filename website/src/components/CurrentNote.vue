<script setup lang="ts">
import YesNoModal from "@/components/reusable/YesNoModal.vue";
import { apiUri, type Note } from "@/exports";
import { ref } from "vue";
const props = defineProps<{
    note: Note;
}>();
const emit = defineEmits<{
    close: [boolean];
}>();
let colorMode = ref<"rgb" | "hex">("hex");
let deleteModalOpen = ref<boolean>(false);

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

function openDeleteModal() {
    deleteModalOpen.value = true;
}
</script>

<template>
    <YesNoModal
        v-show="deleteModalOpen"
        message="Do you want to delete this note?"
        @close="
            (isDeleted: boolean) => {
                deleteModalOpen = false;
                isDeleted == true ? deleteNote() : null;
            }
        " />
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
                <v-textarea v-model="props.note.content" max-rows="25" auto-grow @change="updateNote()"></v-textarea>
            </template>
            <template v-slot:actions>
                <div>
                    <v-btn @click="close()">close</v-btn>
                    <v-btn @click="openDeleteModal()">delete</v-btn>
                </div>
                <div>
                    <v-dialog>
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-btn v-bind="activatorProps">changeColor</v-btn>
                        </template>
                        <template v-slot:default="{ isActive }">
                            <v-container id="colorPickerContainer">
                                <v-color-picker v-model="props.note.color" :mode="colorMode"> </v-color-picker>
                                <v-select :items="['rgb', 'hex']" v-model="colorMode"></v-select>
                                <v-btn
                                    @click="
                                        isActive.value = false;
                                        updateNote();
                                    "
                                    >X</v-btn
                                >
                            </v-container>
                        </template>
                    </v-dialog>
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

.v-card-title > div > div:nth-child(1) {
    text-align: right;
    font-size: 125%;
}
.v-card-title > div > div:nth-child(2) {
    text-align: right;
    font-size: 75%;
}
</style>
