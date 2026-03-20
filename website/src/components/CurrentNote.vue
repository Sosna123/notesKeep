<script setup lang="ts">
import YesNoModal from "@/components/reusable/YesNoModal.vue";
import ColorPicker from "@/components/reusable/ColorPicker.vue";
import AddTags from "@/components/reusable/AddTags.vue";
import { apiUri, type Note } from "@/exports";
import { ref, watch } from "vue";
const props = defineProps<{
    note: Note;
}>();
const emit = defineEmits<{
    noteDeleted: [null];
}>();

let currModified = ref<number>(props.note?.dateOfLastChange ?? 0);

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
        body: JSON.stringify({
            id: props.note.id,
            user_id: props.note.user_id,
            title: props.note.title,
            content: props.note.content,
            dateOfCreation: props.note.dateOfCreation,
            dateOfLastChange: props.note.dateOfLastChange,
            color: props.note.color,
            tags: JSON.stringify(props.note.tags),
        }),
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
        return 1;
    } else {
        return -1;
    }
}

watch(
    () => props.note.tags,
    () => {
        updateNote();
    },
    { deep: true },
);
</script>

<template>
    <v-dialog activator="parent">
        <template v-slot:default="{ isActive }">
            <v-card :color="props.note.color ?? 'dark'">
                <template v-slot:title id="titleSlot" v-slot:default="{ isActive }">
                    <div>
                        <div>
                            <v-textarea v-model="props.note.title" rows="1" no-resize @change="updateNote()"></v-textarea>
                        </div>
                        <div>
                            Created: {{ formatDate(props.note.dateOfCreation) }} <br />
                            Last Modified: {{ formatDate(currModified) }}
                        </div>
                    </div>
                    <v-divider></v-divider>
                </template>
                <template v-slot:text>
                    <v-textarea v-model="props.note.content" max-rows="17" rows="17" auto-grow @change="updateNote()"></v-textarea>
                    <div id="chipDisplay">
                        <div>
                            <v-chip v-for="tag in note.tags">{{ tag }}</v-chip>
                        </div>
                    </div>
                </template>
                <template v-slot:actions>
                    <div>
                        <div>
                            <v-btn
                                @click="
                                    updateNote();
                                    isActive.value = false;
                                "
                                class="bg-success"
                                ><v-icon size="x-large" icon="mdi-check"></v-icon
                            ></v-btn>
                        </div>
                        <div>
                            <YesNoModal
                                message="Do you want to delete this note?"
                                iconBtn="mdi-trash-can"
                                colorBtn="bg-error"
                                :colorBg="note.color!"
                                @clickedYes="
                                    deleteNote();
                                    emit('noteDeleted', null);
                                    isActive.value = false;
                                " />
                            <ColorPicker :note="note" />
                            <AddTags :note="note" />
                        </div>
                    </div>
                </template>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>
div.v-card {
    width: 60%;
    height: 80%;
    margin: auto;
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

#chipDisplay {
    width: 100%;
    overflow-x: scroll;
    height: 42px;
}

#chipDisplay > div {
    display: inline-flex;
    flex-direction: row;
    height: 32px;
    gap: 5px;
}
</style>
