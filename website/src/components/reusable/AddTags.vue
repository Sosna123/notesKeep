<script setup lang="ts">
import { apiUri, type Note } from "@/exports";
import { onMounted, ref } from "vue";

const emit = defineEmits<{
    deleteNote: [null];
}>();
const props = defineProps<{
    note: Note;
}>();

const newTag = ref<string>("");
const tagList = ref<string[]>([]);

async function getTagList() {
    const data = await fetch(`${apiUri}/user/tags`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });

    if (data.ok) {
        let tags = await data.json();
        tagList.value = [...tags];
    }
}

async function addNewTag() {
    if (newTag.value == "" || tagList.value.includes(newTag.value)) {
        newTag.value == "";
        return;
    }

    const data = await fetch(`${apiUri}/user/tags/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ tag: newTag.value }),
    });

    if (data.ok) {
        props.note.tags.push(newTag.value);
        newTag.value = "";
        getTagList();
    }
}

onMounted(() => {
    getTagList();
});
</script>

<template>
    <v-dialog>
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" class="bg-info"><v-icon icon="mdi-plus-circle" size="x-large"></v-icon></v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card id="addTags" :color="props.note.color ?? 'dark'">
                <div id="addNewTagDiv">
                    <v-textarea v-model="newTag" placeholder="Add a new tag" rows="1" no-resize></v-textarea>
                    <v-btn @click="addNewTag()" class="bg-success"><v-icon size="x-large" icon="mdi-plus-circle-outline"></v-icon></v-btn>
                </div>
                <div>
                    <ul>
                        <li v-for="tag in tagList" v-show="tagList.length > 0" :key="tag">
                            {{ tag }}
                            <v-btn v-show="!props.note.tags.includes(tag)" class="bg-success" @click="props.note.tags.push(tag)"><v-icon size="x-large" icon="mdi-plus-circle-outline"></v-icon></v-btn>
                            <v-btn v-show="props.note.tags.includes(tag)" class="bg-error" @click="props.note.tags.splice(props.note.tags.indexOf(tag), 1)"><v-icon size="x-large" icon="mdi-minus-circle-outline"></v-icon></v-btn>
                        </li>
                    </ul>
                </div>
                <v-btn class="bg-success" @click="isActive.value = false"><v-icon icon="mdi-check" size="x-large"></v-icon></v-btn>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>
#addTags {
    display: flex;
    flex-direction: column;
    width: 600px;
    text-align: center;
    padding: 20px;
    gap: 10px;
    border-radius: 4px;
}

#addTags > #yesNoBtns {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
}

.v-overlay .v-card {
    margin: auto;
}

#addNewTagDiv {
    display: flex;
    flex-direction: row;
    gap: 10px;
    height: 80px;
}

#addNewTagDiv > * {
    height: 56px;
}
</style>
