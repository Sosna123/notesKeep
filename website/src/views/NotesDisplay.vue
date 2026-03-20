<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { apiUri, type Note } from "@/exports.ts";
import CurrentNote from "@/components/CurrentNote.vue";
import CreateNote from "@/components/CreateNote.vue";
import FilteringNotes from "@/components/FilteringNotes.vue";

const props = defineProps({ updateNotes: Number });

const notes = ref<Note[]>([]);
const filteredNotes = ref<Note[]>([]);
const filterRules = ref<{ title: string; tags: string[] }>({
    title: "",
    tags: [] as string[],
});
let currNote = ref<Note | null>(null);

async function getUserNotes(): Promise<number> {
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

        json.forEach((el: { tags: string }) => {
            el.tags = JSON.parse(el.tags);
        });

        json.forEach((el: Note) => {
            notes.value.push({
                id: el.id,
                user_id: el.user_id,
                title: el.title,
                content: el.content,
                dateOfCreation: Number(el.dateOfCreation),
                dateOfLastChange: Number(el.dateOfLastChange),
                color: el.color,
                tags: el.tags,
            });
        });

        filterNotes();
        return 1;
    } else {
        console.error("Failed to fetch notes");
        return -1;
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

function filterNotes() {
    let currentFilteringNotes = [...notes.value];

    currentFilteringNotes = currentFilteringNotes.filter((note) => {
        let currFilter = true;

        if (!note.title!.toLowerCase().includes(filterRules.value.title.toLowerCase()) && filterRules.value.title.trim().length > 0) {
            currFilter = false;
        }

        if (filterRules.value.tags.length > 0) {
            filterRules.value.tags.forEach((tag) => {
                if (!note.tags.includes(tag)) {
                    currFilter = false;
                }
            });
        }

        return currFilter;
    });

    filteredNotes.value = [...currentFilteringNotes];
}

onMounted(async () => {
    getUserNotes();
});

watch(
    () => props.updateNotes,
    () => {
        getUserNotes();
    },
);

watch(
    () => filterRules.value,
    () => {
        getUserNotes();
    },
    { deep: true },
);
</script>

<template>
    <CreateNote />
    <FilteringNotes :notes :filterRules />
    <div id="notesContainer">
        <v-card class="note" v-for="note in filteredNotes" @click="currNote = note" :color="note.color ?? 'dark'" :title="note.title ?? '...'" :text="shortCardDesc(note.content ?? '...')">
            <CurrentNote :note />
        </v-card>
    </div>
</template>

<style scoped>
#notesContainer {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    padding-top: 30px;
}

#notesContainer > .note {
    min-width: 10%;
    max-width: 20%;
    cursor: pointer;
}
</style>
