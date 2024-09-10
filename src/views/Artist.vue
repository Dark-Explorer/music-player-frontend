<script setup>
import { onMounted, ref } from 'vue';
import api from '@/layout/api/api';

const artists = ref({});
const getArtists = async () => {
    await api.get('/artists')
        .then((response) => {
            artists.value = response.data.result;
            console.log(response);
        });
}

const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 5,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 4,
        numScroll: 2
    },
    {
        breakpoint: '767px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);

onMounted(() => {
    getArtists();
})

</script>
<template>
<!--    <Carousel :value="artists" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions" :autoplay-interval="5000">-->
<!--        <template #item="slotProps">-->
<!--            <div class="border border-surface-200 dark:border-surface-700 rounded m-2 p-4">-->
<!--                <div class="mb-4">-->
<!--                    <div class="relative mx-auto">-->
<!--                        <img :src="slotProps.data.image" alt="Image" class="w-full rounded" />-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="mb-4 font-medium">{{ slotProps.data.name }}</div>-->
<!--            </div>-->
<!--        </template>-->
<!--    </Carousel>-->
    <Carousel :value="artists" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions" :autoplay-interval="5000">
        <template #item="slotProps">
            <router-link :to="`/artist/${slotProps.data.id}`">
                <div class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 m-2">
                    <img
                        :src="slotProps.data.image"
                        :alt="slotProps.data.name"
                        class="w-full h-48 object-cover"
                    />
                    <div class="p-4">
                        <h2 class="text-lg font-semibold text-gray-800">{{ slotProps.data.name }}</h2>
                    </div>
                </div>
            </router-link>
        </template>
    </Carousel>
<!--    <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4">-->
<!--        <div-->
<!--            v-for="artist in artists"-->
<!--            :key="artist.id"-->
<!--            class="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"-->
<!--        >-->
<!--            <img-->
<!--                :src="artist.image"-->
<!--                :alt="artist.name"-->
<!--                class="w-full h-48 object-cover"-->
<!--            />-->
<!--            <div class="p-4">-->
<!--                <h2 class="text-lg font-semibold text-gray-800">{{ artist.name }}</h2>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
</template>
