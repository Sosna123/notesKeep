<script setup lang="ts">
import { useRouter } from "vue-router";
import { apiUri } from "@/exports";
import { ref } from "vue";
import YesNoModal from "@/components/reusable/YesNoModal.vue";
import ManageTagsSettings from "@/components/ManageTagsSettings.vue";
const router = useRouter();
const emit = defineEmits<{
    logout: [null];
}>();

const deletePass = ref<string>("");
const deleteAccRef = ref<any>(false);

async function logout() {
    const data = await fetch(`${apiUri}/logout`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: localStorage.getItem("refreshToken"),
        }),
    });

    if (await data.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        emit("logout", null);
        router.push("/login");
    }
}

async function deleteAccount() {
    const data = await fetch(`${apiUri}/user/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
            password: deletePass.value,
        }),
    });

    if (await data.ok) {
        deleteAccRef.value = false;
        logout();
    }
}
</script>

<template>
    <div id="settingsButtons">
        <!-- tags management -->
        <ManageTagsSettings />

        <!-- logout -->
        <YesNoModal message="Are you sure you want to log out?" iconBtn="mdi-logout" colorBtn="bg-warning" textBtn="logout" @clickedYes="logout()" />

        <!-- delete account -->
        <v-btn ref="deleteAccRef" class="bg-error"><v-icon icon="mdi-delete-circle" size="x-large"></v-icon>Delete your account</v-btn>
        <v-dialog :activator="deleteAccRef">
            <template v-slot:default="{ isActive }">
                <v-card id="inputModal" color="dark">
                    <p>Type in your password to delete your account</p>
                    <v-text-field v-model="deletePass" type="password"></v-text-field>
                    <div id="inputBtns">
                        <v-btn class="bg-success" @click="deleteAccount()"><v-icon icon="mdi-check" size="x-large"></v-icon></v-btn>
                        <v-btn class="bg-error" @click="isActive.value = false"><v-icon icon="mdi-close" size="x-large"></v-icon></v-btn>
                    </div>
                </v-card>
            </template>
        </v-dialog>
    </div>
</template>

<style scoped>
#settingsButtons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-top: 30px;
}

#inputModal {
    display: flex;
    flex-direction: column;
    width: 340px;
    text-align: center;
    padding: 20px;
    gap: 10px;
    border-radius: 4px;
    margin: auto;
}

#inputModal > #inputBtns {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
}
</style>
