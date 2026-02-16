<script setup lang="ts">
const emit = defineEmits<{
    close: [boolean];
}>();
const props = defineProps<{
    message: string;
}>();
</script>

<template>
    <v-container id="yesNoModalBg">
        <v-card>
            <p>{{ props.message }}</p>
            <v-btn @click="emit('close', true)">Yes</v-btn>
            <v-btn @click="emit('close', false)">No</v-btn>
        </v-card>
    </v-container>
</template>

<style scoped>
#yesNoModalBg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
}

#yesNoModalBg > div.v-card {
    z-index: 3;
    width: 300px;
    height: 100px;
    text-align: center;
    padding: 20px;
}
</style>
