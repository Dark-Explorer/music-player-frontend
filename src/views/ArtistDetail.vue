<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/layout/api/api';

const route = useRoute();
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

// const artist = ref({
//     name: "Sơn Tùng M-TP",
//     followers: "2.527.187",
//     image: "https://via.placeholder.com/150", // Replace with actual artist image URL
//     songs: [
//         {
//             id: 1,
//             title: "Âm Thầm Bên Em",
//             artist: "Sơn Tùng M-TP",
//             duration: "04:51",
//             image: "https://via.placeholder.com/50", // Replace with actual song image URL
//         },
//         {
//             id: 2,
//             title: "Muộn Rồi Mà Sao Còn",
//             artist: "Sơn Tùng M-TP",
//             duration: "04:36",
//             image: "https://via.placeholder.com/50",
//         },
//         {
//             id: 3,
//             title: "Hãy Trao Cho Anh",
//             artist: "Sơn Tùng M-TP, Snoop Dogg",
//             duration: "04:06",
//             image: "https://via.placeholder.com/50",
//         },
//         {
//             id: 4,
//             title: "Nơi Này Có Anh",
//             artist: "Sơn Tùng M-TP",
//             duration: "04:22",
//             image: "https://via.placeholder.com/50",
//         },
//     ],
// });

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
                    <button class="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200">
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              QUAN TÂM
            </span>
                    </button>
                </div>
            </div>

            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Bài Hát Nổi Bật</h2>
            <ul>
                <li
                    v-for="song in songs"
                    :key="song.id"
                    class="flex justify-between items-center bg-gray-50 p-4 rounded hover:bg-gray-200 transition duration-200 mb-2"
                >
                    <div class="flex items-center">
                        <img
                            :src="song.image"
                            :alt="song.title"
                            class="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                            <h3 class="font-semibold text-gray-800">{{ song.title }}</h3>
                            <p class="text-gray-600">{{ song.artist }}</p>
                        </div>
                    </div>
<!--                    <span class="text-gray-500">{{ song.duration }}</span>-->
                </li>
            </ul>
        </div>
    </div>
</template>
