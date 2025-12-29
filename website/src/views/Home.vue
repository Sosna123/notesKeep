<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { apiUri, type Note } from "../exports";
import CurrentNote from "../components/CurrentNote.vue";

const notes = ref<Note[]>([]);
let currNote = ref<Note | null>(null);

async function getUserNotes() {
    console.log("123123");
    notes.value = [];
    notes.value.length = 0;

    const data = await fetch(`${apiUri}/user/notes`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });

    if (data.ok) {
        const json = await data.json();
        json.forEach((el: Note) => {
            notes.value.push({
                id: el.id,
                user_id: el.user_id,
                title: el.title,
                content: el.content,
                dateOfCreation: Number(el.dateOfCreation),
                dateOfLastChange: Number(el.dateOfLastChange),
                color: null,
            });
        });
    } else {
        console.error("Failed to fetch notes");
    }
}

function shortCardDesc(text: string): string {
    const maxLength: number = 800;
    let length: number = 0;
    const textArr: string[] = text.split(" ");
    let currTextArr: string[] = [];

    textArr.forEach((el) => {
        if (length + el.length <= maxLength) {
            currTextArr.push(el);
            length += el.length + 1;
        } else {
            return;
        }
    });

    let finalText = currTextArr.join(" ");
    if (finalText.length != 0) {
        if (currTextArr.length < textArr.length) {
            finalText += "...";
        }

        return finalText;
    } else {
        return textArr[0]?.substring(0, maxLength) + "...";
    }
}

onMounted(() => {
    getUserNotes();
});
</script>

<template>
    <div id="notesContainer">
        <v-card class="note w-15" v-for="note in notes" @click="currNote = note" :color="note.color ?? 'dark'" :title="note.title ?? '...'" :text="shortCardDesc(note.content ?? '...')"></v-card>
    </div>

    <CurrentNote
        @close="
            currNote = null;
            getUserNotes();
        "
        :note="currNote"
        v-if="currNote != null" />
</template>

<style scoped>
#notesContainer {
    display: flex;
    flex-wrap: wrap;
    padding: 30px;
    gap: 15px;
}
</style>
