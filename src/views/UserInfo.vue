<script setup>
import { onMounted, ref } from 'vue';
import api from '@/layout/api/api';
import { useToast } from 'primevue/usetoast';

let userId = ref();
const toast = useToast();
const info = ref({});
const email = ref();
const password = ref();
const confirmPassword = ref();
const validate_email = ref(true);
const validate_password = ref(true);
const validate_password_confirmation = ref(true);
const editDialog = ref(false);

function showDialog() {
    editDialog.value = true;
}

function hideDialog() {
    editDialog.value = false;
}

async function fetchInfo() {
    await api.get(`/users/myInfo`)
        .then((response) => {
            info.value = response.data.result;
            userId = response.data.result.id;
        }).catch(() => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'There are some errors, please try again!', life: 3000 });
        })
}

const validatePassword = () => {
    return validate_password.value = password.value.length >= 6;
};

const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validate_email.value = emailPattern.test(email.value);
};

const validateConfirmPassword = () => {
    return validate_password_confirmation.value = confirmPassword.value === password.value;
}

async function editInfo() {
    if (validateEmail() && validatePassword() && validateConfirmPassword()){
        await api.put(`/users/${userId}`, {
            email: email.value,
            password: password.value,
        }).then(() => {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Update successfully', life: 3000 });
            hideDialog()
        }).catch(() => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'There are some errors, please try again!', life: 3000 });
        })
    }
}

onMounted(() => {
    fetchInfo();
})

</script>

<template>
    <div class="bg-surface-0 dark:bg-surface-950 p-10 md:p-20">
        <div class="bg-surface-0 dark:bg-surface-950">
            <div class="font-medium text-3xl text-surface-900 dark:text-surface-0 mb-4">User Information</div>
            <ul class="list-none p-0 m-0">
                <li class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
                    <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Name</div>
                    <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">{{ info.name }}</div>
                </li>
                <li class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
                    <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Username</div>
                    <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">{{ info.username }}</div>
                </li>
                <li class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
                    <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Email</div>
                    <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">{{ info.email }}</div>
                </li>
                <li class="flex items-center py-4 px-2 border-t border-b border-surface flex-wrap">
                    <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">Password</div>
                    <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1 leading-normal"></div>
                    <div class="w-6/12 md:w-2/12 flex justify-end">
                        <Button label="Edit info" icon="pi pi-pencil" text @click="showDialog"/>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <Dialog v-model:visible="editDialog" :style="{ width: '450px' }" header="Edit info" :modal="true">
        <div class="flex flex-col gap-6">
            <div>
                <label for="email" class="block font-bold mb-3">Email</label>
                <InputText id="email" v-model="email" required="true" fluid />
                <Message severity="error" v-if="!validate_email">Invalid email</Message>
            </div>
            <div>
                <label for="password" class="block font-bold mb-3">Password</label>
                <Password id="password" v-model="password" fluid />
                <Message severity="error" v-if="!validate_password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password must be at least 6 characters</Message>
            </div>
            <div>
                <label for="re-password" class="block font-bold mb-3">Confirm password</label>
                <Password id="re-password" v-model="confirmPassword" fluid />
                <Message severity="error" v-if="!validate_password_confirmation" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Passwords do not match!</Message>
            </div>
        </div>
        <template #footer>
            <Button label="Save" icon="pi pi-check" text @click="editInfo" />
            <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        </template>
    </Dialog>
</template>

<style scoped lang="scss">

</style>
