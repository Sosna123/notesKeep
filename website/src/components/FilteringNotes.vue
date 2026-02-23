<script setup lang="ts">
import { type Note, apiUri } from "@/exports";
import { onMounted, ref } from "vue";
const props = defineProps<{
    notes: Note[];
    filterRules: {
        title: string;
        tags: string[];
    };
}>();

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

function resetValues() {
    props.filterRules.title = "";
    props.filterRules.tags = [];
}

onMounted(() => {
    getTagList();
});
</script>

<template>
    <v-dialog>
        <template v-slot:activator="{ props: activatorProps }">
            <div id="filterActivator">
                <v-btn v-bind="activatorProps" @click="getTagList()" class="bg-info" prepend-icon="mdi-filter">Filter your notes</v-btn>
                <v-chip v-show="props.filterRules.title.trim().length > 0" @click="props.filterRules.title = ''" append-icon="mdi-close-circle-outline">Title with: {{ props.filterRules.title }}</v-chip>
                <v-chip v-for="tag in props.filterRules.tags" @click="props.filterRules.tags.splice(props.filterRules.tags.indexOf(tag), 1)" append-icon="mdi-close-circle-outline">{{ tag }}</v-chip>
            </div>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card id="filterContainer" class="bg-grey-darken-3">
                <v-text-field label="Title" v-model="props.filterRules.title"></v-text-field>
                <v-select label="Tags" v-model="props.filterRules.tags" :items="tagList" multiple></v-select>
                <div id="filterButtonControls">
                    <v-btn @click="isActive.value = false" class="bg-success"><v-icon icon="mdi-check" size="x-large"></v-icon></v-btn>
                    <v-btn @click="resetValues()" class="bg-error"><v-icon icon="mdi-restart" size="x-large"></v-icon></v-btn>
                </div>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>
#filterContainer {
    width: 50%;
    margin: auto;
    padding: 30px;
}

#filterButtonControls {
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 20px;
}

#filterButtonControls > button.v-btn {
    width: 100px;
}

#filterActivator {
    display: flex;
    align-items: center;
    gap: 15px;
}
</style>
