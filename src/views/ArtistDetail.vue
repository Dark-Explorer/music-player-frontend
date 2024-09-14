<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/layout/api/api';

const route = useRoute();
const toast = useToast();
const artistId = computed(() => route.params.id);
const artist = ref({});
const songs = ref({});

async function fetchArtistDetail(id) {
    await api.get(`/artists/info/${id}`)
        .then((response) => {
            artist.value = response.data.result;
        }).catch((error) => {
            console.log(error);
        })
}

async function fetchSongsByArtist(id) {
    await api.get(`/songs/${id}/songs`)
        .then((response) => {
            songs.value = response.data.result;
        }).catch((error) => {
            console.log(error);
        })
}

onMounted(() => {
    fetchArtistDetail(artistId.value);
    fetchSongsByArtist(artistId.value);
})

</script>
<template>
    <div class="bg-gray-100 min-h-screen p-6">
        <div class="bg-white shadow-lg rounded-lg p-6">
            <div class="flex items-center mb-6">
                <img
                    :src="artist.image"
                    :alt="artist.name"
                    class="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                />
                <div class="ml-4">
                    <h1 class="text-4xl font-bold text-gray-800">{{ artist.name }}</h1>
                    <p>YOB: {{ artist.yob }}</p>
                </div>
            </div>

            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Bài Hát Nổi Bật</h2>
            <ul>
                <li
                    v-for="song in songs"
                    :key="song.id"
                    class="flex justify-between items-center bg-gray-50 p-4 rounded hover:bg-gray-200 transition duration-200 mb-2"
                >
                    <router-link :to="`/song/${song.id}`">
                        <div class="flex items-center">
                            <img
                                :src="song.image"
                                :alt="song.title"
                                class="w-12 h-12 object-cover rounded mr-3"
                            />
                            <div>
                                <h3 class="font-semibold text-gray-800">{{ song.title }}</h3>
<!--                                <p class="text-gray-600">{{ song.artist }}</p>-->
                            </div>
                        </div>
                    </router-link>
<!--                    <span class="text-gray-500">{{ song.duration }}</span>-->
                </li>
            </ul>
        </div>
    </div>
</template>
