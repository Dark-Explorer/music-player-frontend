<template>
    <MultiSelect
        id="artists"
        v-model="selectedCities"
        :options="cities"
        optionLabel="name"
        placeholder="Select Cities"
        fluid filter
        display="chip"
    />
</template>

<script setup>
import { onMounted, ref } from 'vue';

const cities = ref([
    { name: 'New York', code: 'NY', id: 1 },
    { name: 'Rome', code: 'RM', id: 2 },
    { name: 'London', code: 'LDN', id: 3 },
    { name: 'Paris', code: 'PRS', id: 4 }
]);

// Preselect New York and London
const selectedCities = ref([
    { name: 'New York', code: 'NY', id: 1 },
    { name: 'London', code: 'LDN', id: 3 }
]);

const allArtists = ref([
    { name: 'LMAO', id: 1 },
    { name: 'dada', id: 2 },
    { name: 'hgjjgl', id: 3 },
    { name: 'daaaa', id: 4 }
]);
const selectedArtists = ref([
    { name: 'LMAO', id: 1 },
    { name: 'hgjjgl', id: 3 }
]);

const otherCities = ref([
    {}
])

function getAll() {
    console.log(allArtists);
    console.log(selectedArtists)
}

onMounted(() => {
    getAll();
})
</script>
