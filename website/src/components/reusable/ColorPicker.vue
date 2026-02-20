<script setup lang="ts">
import { type Note } from "@/exports";

const props = defineProps<{
    note: Note;
}>();
const emit = defineEmits<{
    close: [null];
}>();
</script>

<template>
    <v-dialog>
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" class="bg-info"><v-icon icon="mdi-palette" size="x-large"></v-icon></v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card id="colorPickerContainer" :style="{ backgroundColor: props.note.color! }">
                <v-color-picker v-model="props.note.color" :modes="['rgb', 'hex']"></v-color-picker>
                <v-btn @click="isActive.value = false" class="bg-success"><v-icon size="x-large" icon="mdi-check"></v-icon></v-btn>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>
#colorPickerContainer {
    display: flex;
    flex-direction: column;
    width: 340px;
    background-color: #212121;
    text-align: center;
    padding: 20px;
    gap: 10px;
}

#colorPickerContainer > button {
    align-self: center;
    width: 50px;
}

.v-overlay {
    background-color: rgba(0, 0, 0, 0.5);
}

.v-overlay .v-card {
    margin: auto;
}
</style>
