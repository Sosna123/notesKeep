<script setup lang="ts">
const emit = defineEmits<{
    deleteNote: [null];
}>();
const props = defineProps<{
    message: string;
    iconBtn: string;
    colorBtn: string;
    colorBg: string;
}>();
</script>

<template>
    <v-dialog>
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" :class="props.colorBtn"><v-icon :icon="props.iconBtn" size="x-large"></v-icon></v-btn>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card id="yesNoModal" :color="props.colorBg ?? 'dark'">
                <p>{{ props.message }}</p>
                <div id="yesNoBtns">
                    <v-btn
                        class="bg-success"
                        @click="
                            isActive.value = false;
                            emit('deleteNote', null);
                        "
                        ><v-icon icon="mdi-check" size="x-large"></v-icon
                    ></v-btn>
                    <v-btn class="bg-error" @click="isActive.value = false"><v-icon icon="mdi-close" size="x-large"></v-icon></v-btn>
                </div>
            </v-card>
        </template>
    </v-dialog>
</template>

<style scoped>
#yesNoModal {
    display: flex;
    flex-direction: column;
    width: 340px;
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
