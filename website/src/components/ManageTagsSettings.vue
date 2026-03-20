<script setup lang="ts">
import { apiUri } from "@/exports";
import { onMounted, ref } from "vue";
import YesNoModal from "@/components/reusable/YesNoModal.vue";

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
        newTag.value = "";
        getTagList();
    }
}

async function deleteTag(tag: string) {
    if (tag == "") {
        return;
    }

    const data = await fetch(`${apiUri}/user/tags/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ tag }),
    });

    if (data.ok) {
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
            <v-btn v-bind="activatorProps" class="bg-info"><v-icon icon="mdi-plus-circle" size="x-large"></v-icon> Manage tags</v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card id="addTags" color="dark">
                <div id="addNewTagDiv">
                    <v-textarea v-model="newTag" placeholder="Add a new tag" rows="1" no-resize></v-textarea>
                    <v-btn @click="addNewTag()" class="bg-success"><v-icon size="x-large" icon="mdi-plus-circle-outline"></v-icon></v-btn>
                </div>
                <div>
                    <ul>
                        <li v-for="tag in tagList" v-show="tagList.length > 0" :key="tag">
                            {{ tag }}
                            <YesNoModal :message="`Are you sure you want to delete ${tag}`" iconBtn="mdi-minus-circle-outline" colorBtn="bg-error" @clickedYes="deleteTag(tag)" />
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
