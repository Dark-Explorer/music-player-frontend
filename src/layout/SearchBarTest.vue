<template>
    <div class="flex-row justify-between items-center search-box">
        <!-- Your existing search bar code here -->
        <div>
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="keyword" placeholder="Search" class="w-96" @change="toggle"/>
            </IconField>
            <Popover ref="op">
                <ul class="list-none p-0 m-0 flex flex-col gap-4">
                    <li v-for="result in results" :key="result.id" class="flex items-center gap-2">
                        <img :src="result.image" alt="Pic" style="width: 32px" />
                        <div>
                            <span class="font-medium">{{ result.name }}</span>
                            <span class="font-medium">{{ result.title }}</span>
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
const keyword = ref();
const results = ref([]);
const members = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
]);

async function fetchResult(keyword) {
    await api.get(`/search`, {
        params: {
            keyword: keyword.value
        }
    }).then((response) => {
        results.value = response.data;
        console.log(response);
    }).catch((error) => {
        console.log(error);
    })
}

const toggle = (event) => {
    op.value.toggle(event);
    console.log()
    fetchResult(keyword);
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
