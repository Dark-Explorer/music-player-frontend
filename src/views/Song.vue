<script setup>
import { ref, computed, onMounted } from 'vue';
import { VueSound } from 'vue-sound';
import { useRoute } from 'vue-router';
import api from '@/layout/api/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const route = useRoute();
const songId = computed(() => route.params.id);
const song = ref({});
const playlistName = ref();
const playlists = ref();
const addToPlaylistDialog = ref(false);
const submitted = ref(false);
const selectedPlaylist = ref();
const newPlaylistDialog = ref(false);
const submittedNewPlaylist = ref(false);

function openPlaylistDialog() {
    addToPlaylistDialog.value = true;
    getCurrentUserPlaylist()
}

function hidePlaylistDialog() {
    addToPlaylistDialog.value = false;
    submitted.value = false;
}

function openNewPlaylistDialog() {
    newPlaylistDialog.value = true;
}

function hideNewPlaylistDialog() {
    newPlaylistDialog.value = false;
    submittedNewPlaylist.value = false;
}

async function fetchSongDetail(id) {
    await api.get(`/songs/${id}`)
        .then((response) => {
            song.value = response.data.result;
        }).catch((error) => {
            console.log(error);
        })
}

async function addSongToPlaylist(playlistId, songId) {
    await api.post(`/playlists/${playlistId}/songs/${songId}`)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Song added to playlist', life: 3000 });
        }).catch(() => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'There are some errors, please try again!', life: 3000 });
        })
}

async function createNewPlaylist() {
    hideNewPlaylistDialog();
    await api.post(`/playlists`, {
        name: playlistName.value
    }).then(() => {
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Playlist created', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'There are some errors, please try again!', life: 3000 });
    })
}

async function getCurrentUserPlaylist() {
    await api.get(`/playlists/myPlaylists`)
        .then((response) => {
            playlists.value = response.data.result.map(playlist => ({
                id: playlist.id,
                name: playlist.name
            }));
        }).catch((error) => {
            console.log(error);
        })
}

onMounted(() => {
    fetchSongDetail(songId.value);
})

</script>

<template>
    <div class="flex">
        <div class="song-player p-4 w-2/3">
            <Card class="song-card">
                <template #title>
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold mb-4">{{ song.title }}</h2>
                        <Button label="Add to playlist" icon="pi pi-plus" icon-pos="left" @click="openPlaylistDialog" />
                    </div>
                </template>
                <template #content>
                    <vue-sound
                        :image="song.image"
                        :file="song.sound_link"
                    />
                </template>
            </Card>
        </div>
        <div class="artist-gallery w-1/3 p-4 mx-auto">
            <h2 class="text-2xl font-bold mb-4">Artists</h2>
            <div class="flex flex-wrap">
                <Card v-for="artist in song.artists" :key="artist.id" class="m-2 w-full">
                    <template #content>
                        <router-link :to="`/artist/${artist.id}`">
                            <div class="flex items-center bg-white shadow-md rounded-lg p-4">
                                <img
                                    :src="artist.image"
                                    :alt="artist.name"
                                    class="rounded-full w-24 h-24 object-cover mr-4"
                                />
                                <h3 class="text-lg font-semibold">{{ artist.name }}</h3>
                            </div>
                        </router-link>
                    </template>
                </Card>
            </div>
        </div>
<!--        <div>-->
<!--            <div v-for="artist in song.artists" :key="song.id">-->
<!--                <p>{{ artist.name }}</p>-->
<!--                <img :src="artist.image" :alt="artist.name" />-->
<!--            </div>-->
<!--        </div>-->
        <Dialog v-model:visible="addToPlaylistDialog" :style="{ width: '450px' }" header="Add to playlist" :modal="true">
            <div class="flex flex-col gap-6">
                <div v-for="playlist in playlists" :key="playlist.id" class="flex flex-wrap gap-2">
                    <RadioButton v-model="selectedPlaylist" :inputId="playlist.id" name="playlist" :value="playlist.id" />
                    <label :for="playlist.id">{{ playlist.name }}</label>
                </div>
                <div class="flex flex-wrap">
                    <Button type="button" label="Add" icon="pi pi-check" @click="addSongToPlaylist(selectedPlaylist, song.id)" />
                </div>
            </div>
            <template #footer>
                <Button label="Create new playlist" icon="pi pi-plus" text @click="openNewPlaylistDialog" />
                <Button label="Cancel" icon="pi pi-times" text @click="hidePlaylistDialog" />
    <!--            <Button label="Save" icon="pi pi-check" @click="editArtist(artist.id)" />-->
            </template>
        </Dialog>
        <Dialog v-model:visible="newPlaylistDialog" :style="{ width: '450px' }" header="New playlist" :modal="true">
            <div class="flex flex-col gap-6">
                <div>
                    <label for="newPlaylist" class="block font-bold mb-3">Name</label>
                    <InputText id="newPlaylist" v-model="playlistName" required="true" fluid />
                </div>
            </div>
            <template #footer>
                <Button label="Save" icon="pi pi-check" text @click="createNewPlaylist" />
                <Button label="Cancel" icon="pi pi-times" text @click="hideNewPlaylistDialog" />
            </template>
        </Dialog>
    </div>
</template>

<style>
:root{
    --player-background: #00123e;
    --player-font-family: "Open Sans", sans-serif;
    --player-font-size: 0.9rem;
    --player-font-size-small: 1rem;
    --player-font-weight: 300;
    --player-font-weight-bold: 600;
    --player-text-color: #ffffff;
    --player-icon-color: var(--player-text-color);
    --player-link-color: var(--player-text-color);
    --player-progress-color: #41b883;
    --player-buffered-color: #41b883;
    --player-seeker-color: #ffffff;
    --player-input-range-color: var(--player-text-color);
}
//:root{--player-background: #00123e;--player-font-family: "Open Sans", sans-serif;--player-font-size: .9rem;--player-font-size-small: 1rem;--player-font-weight: 300;--player-font-weight-bold: 600;--player-text-color: #ffffff;--player-icon-color: var(--player-text-color);--player-link-color: var(--player-text-color);--player-progress-color: #41b883;--player-buffered-color: #41b883;--player-seeker-color: #ffffff;--player-input-range-color: var(--player-text-color)}.player-image{display:flex}.player-image img{max-width:100%;height:auto}.player{background-color:var(--player-background);padding:.85rem;font-family:var(--player-font-family);font-weight:var(--player-font-weight);position:relative}.player a,.player a:visited,.player a:active{color:var(--player-link-color);text-decoration:none}.player a:hover,.player a:visited:hover,.player a:active:hover{text-decoration:underline}.player-controls{display:flex;align-items:center}.player-back-15-icon,.player-play-pause-icon,.player-ahead-15-icon,.player-download-icon,.player-volume-icon{display:flex;fill:var(--player-icon-color)}.player-back-15-icon{margin-right:1rem;width:20px}.player-ahead-15-icon{margin-left:1rem;width:20px}.player-download-icon{display:none}@media all and (min-width: 768px){.player-download-icon{display:flex;margin-left:1rem}}.player-track{flex:auto;padding:0 2rem;overflow:hidden;width:100%}.player-track-title{color:var(--player-text-color);font-size:var(--player-font-size);font-weight:var(--player-font-weight-bold);width:100%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.player-track-title-details,.player-track-title-details-link{font-weight:var(--player-font-weight);color:var(--player-text-color);font-weight:300}.player-track-progress{position:absolute;background-color:var(--player-progress-color);cursor:pointer;min-width:200px;top:0;left:0;right:0;height:5px}@media all and (min-width: 768px){.player-track-progress{top:-5px;height:3px;margin-top:.75rem;position:relative}}.player-track-progress .player-track-seeker{background-color:var(--player-seeker-color);bottom:0;left:0;position:absolute;top:0;z-index:20}.player-track-progress .player-track-buffered{background-color:var(--player-buffered-color);bottom:0;left:0;position:absolute;top:0;z-index:10}.player-track-progress .player-track-playhead{position:absolute;height:22px;width:22px;margin:-8px -16px;transform:scale(0);left:0;opacity:0;bottom:0;transition:opacity .2s linear,transform .2s}.player-track-progress .player-track-playhead:after{content:"";height:22px;width:22px;background-color:var(--player-buffered-color);border-radius:50%;opacity:1;display:block;position:absolute;left:calc(50% - 11px);top:calc(50% - 11px)}.player-track-time{display:flex;color:var(--player-text-color);font-size:var(--player-font-size-small);font-weight:var(--player-font-weight-bold)}@media all and (min-width: 768px){.player-track-time{justify-content:flex-end}}.player-track-time .player-track-time-current{opacity:1;margin-right:.25rem}.player-track-time .player-track-time-separator{opacity:.6}.player-track-time .player-track-time-total{opacity:.6;margin-left:.25rem}.player-volume{display:none}@media all and (min-width: 768px){.player-volume{display:flex;justify-content:flex-end}}input[type=range]{-webkit-appearance:none;background:transparent;width:100%;margin-right:1.5rem}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none}input[type=range]:focus{outline:none}input[type=range]::-ms-track{width:100%;cursor:pointer;background:transparent;border-color:transparent;color:transparent}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;height:15px;width:15px;border-radius:50%;background:var(--player-input-range-color);cursor:pointer;margin-top:-6px}input[type=range]::-moz-range-thumb{height:15px;width:15px;border-radius:50%;background:var(--player-input-range-color);cursor:pointer}input[type=range]::-ms-thumb{height:15px;width:15px;border-radius:50%;background:var(--player-input-range-color);cursor:pointer}input[type=range]::-webkit-slider-runnable-track{width:100%;height:3px;cursor:pointer;background:var(--player-input-range-color)}input[type=range]:focus::-webkit-slider-runnable-track{background:var(--player-input-range-color)}input[type=range]::-moz-range-track{width:100%;height:3px;cursor:pointer;background:var(--player-input-range-color)}input[type=range]::-ms-track{width:100%;height:3px;cursor:pointer;background:transparent;border-color:transparent;border-width:16px 0;color:transparent}input[type=range]::-ms-fill-lower{background:var(--player-input-range-color)}input[type=range]:focus::-ms-fill-lower{background:var(--player-input-range-color)}input[type=range]::-ms-fill-upper{background:var(--player-input-range-color)}input[type=range]:focus::-ms-fill-upper{background:var(--player-input-range-color)}.slide-left-enter-active,.slide-left-leave-active,.slide-right-enter-active,.slide-right-leave-active{transition-duration:var(--animation-duration);transition-property:height,opacity,transform;transition-timing-function:cubic-bezier(.55,0,.1,1);overflow:hidden}.slide-left-enter,.slide-right-leave-active{opacity:0;transform:translate(2em)}.slide-left-leave-active,.slide-right-enter{opacity:0;transform:translate(-2em)}.hide-ally-element{border:0;clip:rect(1px 1px 1px 1px);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}
</style>
