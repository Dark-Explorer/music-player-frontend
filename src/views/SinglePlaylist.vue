<script setup>
import { computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import api from '@/layout/api/api';
import { useRoute } from 'vue-router';

const toast = useToast();
const route = useRoute();
const playlistId = computed(() => route.params.id);
const playlist = ref({});
const test = ref({
    id: 1,
    test: 1,
    slot: [1, 2, 3]
})
let emptyPlaylist;

// const tmp = ref(playlist.songs.length);

async function fetchPlaylist(id) {
    await api.get(`/playlists/${id}`)
        .then((response) => {
            playlist.value = response.data.result;
            emptyPlaylist = computed(() => {
                return playlist.value.songs.length === 0 ? 1 : 0;
            })
        }).catch(() => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'There are some errors, please try again!', life: 3000 });
        })
}

async function removeSongFromPlaylist(playlistId, songId) {
    await api.delete(`/playlists/${playlistId}/songs/${songId}`)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Song removed from playlist!', life: 3000 });
            window.location.reload();
        }).catch(() => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'There are some errors, please try again!', life: 3000 });
        })
}

onMounted(() => {
    fetchPlaylist(playlistId.value);
    console.log(playlist)
    // console.log(tmp.value);
})

</script>

<template>
    <div class="bg-surface-0 dark:bg-surface-950 p-10 md:p-20">
        <div class="bg-surface-0 dark:bg-surface-950">
            <div class="font-medium text-3xl text-surface-900 dark:text-surface-0 mb-4">{{ playlist.name }}</div>
            <p class="font-medium text-xl text-surface-900 dark:text-surface-0 mb-4" v-if="emptyPlaylist">This playlist is empty</p>

            <ul class="list-none p-0 m-0">
                <li
                    v-for="song in playlist.songs"
                    :key="song.id"
                    class="flex justify-between items-center bg-gray-50 p-4 rounded hover:bg-gray-200 transition duration-200 mb-2"
                >
                    <router-link :to="`/song/${song.id}`">
                        <div class="flex items-center justify-between">
                            <img
                                :src="song.image"
                                :alt="song.title"
                                class="w-12 h-12 object-cover rounded mr-3"
                            />
                            <div class="flex items-center">
                                <div>
                                    <h3 class="font-semibold text-gray-800">{{ song.title }}</h3>
                                    <p v-for="artist in song.artists" class="text-gray-600 flex">{{ artist.name }}</p>
                                </div>
                            </div>
                        </div>
                    </router-link>
                    <Button label="Remove" severity="danger" icon="pi pi-times" icon-pos="left" class="ml-4 right-0" @click="removeSongFromPlaylist(playlistId, song.id)" />
                </li>
            </ul>
        </div>
    </div>
</template>
