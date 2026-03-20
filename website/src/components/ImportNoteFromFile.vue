<script setup lang="ts">
import { ref } from "vue";
import { type Note } from "@/exports";
const props = defineProps<{
    note: Note;
}>();

const currFile = ref<any>();
const fileContent = ref<string>("");
const fileName = ref<string>("");

function readFromFile() {
    console.log(currFile.value);
    const reader = new FileReader();

    if (currFile.value) {
        reader.addEventListener("load", () => {
            fileContent.value = reader.result!.toString();
            fileName.value = currFile.value.name;

            // remove file names
            fileName.value = fileName.value.replace(/(\.txt)|(\.md)$/, " ");

            props.note.title = fileName.value;
            props.note.content = fileContent.value;
        });

        reader.readAsText(currFile.value);
    }
}
</script>

<template>
    <v-dialog>
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" class="bg-success"><v-icon icon="mdi-file-import" size="x-large"></v-icon>Import from file</v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card id="yesNoModal" color="dark">
                <v-file-input v-model="currFile" accept="text/plain" label="Your text file" prepend-icon="mdi-text-box"></v-file-input>
                <v-btn
                    class="bg-success"
                    @click="
                        readFromFile();
                        isActive.value = false;
                    "
                    ><v-icon icon="mdi-check" size="x-large"></v-icon
                ></v-btn>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>
#yesNoModal {
    display: flex;
    flex-direction: column;
    width: 540px;
    text-align: center;
    padding: 20px;
    gap: 10px;
    border-radius: 4px;
}

#yesNoModal > #yesNoBtns {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
}

.v-overlay .v-card {
    margin: auto;
}
</style>
