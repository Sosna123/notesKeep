<script setup lang="ts">
import { watch } from "vue";
const props = defineProps<{
    message: string;
}>();
const emit = defineEmits<{
    close: [null];
}>();

let turnOffTimeout: number = -1;

function closeComponent() {
    clearTimeout(turnOffTimeout);
    emit("close", null);
}

watch(
    () => props.message,
    () => {
        turnOffTimeout = setTimeout(() => {
            closeComponent();
        }, 10 * 1000);
    },
);
</script>

<template>
    <v-container id="errorDisplay">
        <div id="flexErrorDisplay">
            <div>
                {{ props.message }}
            </div>
            <v-btn @click="closeComponent()">close</v-btn>
        </div>
    </v-container>
</template>

<style scoped>
#errorDisplay {
    position: absolute;
    bottom: 25px;
    right: 25px;
    width: 550px;
    height: 150px;
    border: 1px solid black;
    padding: 0;
}

#flexErrorDisplay {
    display: flex;
    flex-direction: row;
    height: 100%;
    justify-content: space-evenly;
    align-items: center;
}

#flexErrorDisplay > div {
    width: 60%;
}

#flexErrorDisplay > button.v-btn {
    width: 25%;
}
</style>
