<template>
    <div class="flex-row justify-between items-center search-box">
        <!-- Your existing search bar code here -->
        <div>
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="value1" placeholder="Search" class="w-96" @change="toggle"/>
            </IconField>
            <Popover ref="op">
                <ul class="list-none p-0 m-0 flex flex-col gap-4">
                    <li v-for="member in members" :key="member.name" class="flex items-center gap-2">
                        <img :src="`https://primefaces.org/cdn/primevue/images/avatar/${member.image}`" style="width: 32px" />
                        <div>
                            <span class="font-medium">{{ member.name }}</span>
                            <div class="text-sm text-surface-500 dark:text-surface-400">{{ member.email }}</div>
                        </div>
                        <div class="flex items-center gap-2 text-surface-500 dark:text-surface-400 ml-auto text-sm">
                            <span>{{ member.role }}</span>
                            <i class="pi pi-angle-down"></i>
                        </div>
                    </li>
                </ul>
            </Popover>
        </div>
    </div>
</template>

<script setup>
import Popover from 'primevue/popover';
import { ref } from 'vue';
import api from '@/layout/api/api';

const op = ref();

const members = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
]);

const toggle = (event) => {
    op.value.toggle(event);
}
</script>

<style scoped>
.dropdown-list ul {
    background: white;
}

.search-box {
    z-index: 100;
}
</style>
