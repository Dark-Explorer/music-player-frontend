<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref, watch } from 'vue';
import api from '@/layout/api/api';

const toast = useToast();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const submitted = ref(false);

const rowIndex = ref();
const songDialog = ref(false);
const deleteSongDialog = ref(false);
const songs = ref();
const song = ref({});
const artists = ref({});
const artistModified = ref();
const newSong = reactive({
    id: '',
    title: '',
    image: '',
    sound_link: null,
    artistsId: [],
    artists: null
});

watch(newSong.image, (newVal) => {
});

const getArtists = async () => {
    await api.get('/artists')
        .then((response) => {
            // artistsList.value = response.data.result;
            artists.value = response.data.result.map(artist => ({
                value: artist.id,
                label: artist.name
            }));
            console.log(artists.value);
        });
}

// Get list of all artists (to render the table)
const getSongs = async () => {
    await api.get('/songs')
        .then((response) => {
            songs.value = response.data.result;
            console.log(response.data.result)
        });
}

// Open dialog for adding new artist
function openNew() {
    newSong.id = '';
    newSong.title = '';
    newSong.image = '';
    newSong.sound_link = null;
    newSong.artistsId = [];
    newSong.artists = null;

    submitted.value = false;
    songDialog.value = true;
}

// Call API for creating new artist
async function createSong() {
    submitted.value = true;
    await api.post(`/songs`, {
        title: newSong.title,
        image: newSong.image,
        sound_link: newSong.sound_link,
        artistsId: newSong.artistsId
    }).then(async () => {
        const requests = newSong.artistsId.map(id =>
            api.get(`/artists/${id}`)
        );
        const responses = await Promise.all(requests);
        newSong.artists.value = responses.map(response => response.data);

        songs.value.push(newSong);
        // song.value = {};
        songDialog.value = false;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Song created', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'There is an error in creating song', life: 3000 });
    });
}

async function findArtistById(id) {
    await api.get(`/artists/${id}`)
        .then((response) => {
            artistModified.value = response.data.result;
        }).catch((error) => {
            console.log(error);
        })
}

// Open dialog for editing artist
function openEditSong(curr_song, index) {
    newSong.id = curr_song.id;
    newSong.title = curr_song.title;
    newSong.image = curr_song.image;
    newSong.sound_link = curr_song.sound_link;
    newSong.artistsId = curr_song.artistsId;

    songDialog.value = true;
    rowIndex.value = index;
}

function hideEditDialog() {
    songDialog.value = false;
    submitted.value = false;
}

// Call API for editting artist
async function editSong(id) {
    await api.put(`/songs/${id}`, {
        title: newSong.title,
        image: newSong.image,
        sound_link: newSong.sound_link,
        artistsId: newSong.artistsId
    }).then(() => {
        songs.value[rowIndex.value] = newSong;
        songDialog.value = false;
        // song.value = {};
        submitted.value = true;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Song updated', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'There is an error in updating', life: 3000 });
    });
}

function confirmDeleteSong(curr_song) {
    newSong.id = curr_song.id;
    newSong.title = curr_song.title;
    deleteSongDialog.value = true;
}

// Call API to deleting artist
async function deleteSong(id) {
    await api.delete(`/songs/${id}`)
        .then(() => {
            songs.value = songs.value.filter((val) => val.id !== newSong.id);
            deleteSongDialog.value = false;
            // song.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Song deleted', life: 3000 });
        }).catch(() => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'There is an error in deleting', life: 3000 });
        })
}

onMounted(() => {
    getSongs();
    getArtists();
})

</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew" />
                    <!--                    <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />-->
                </template>

<!--                <template #end>-->
<!--                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />-->
<!--                </template>-->
            </Toolbar>

            <DataTable :value="songs" :paginator="true" :rows="10" :filters="filters" data-key="id">
                <Column field="title" header="Title" sortable=""></Column>
                <Column field="artist" header="Artist">
                    <template #body="slotProps">
                        <ul>
                            <li v-for="artist in slotProps.data.artists" :key="artist.id">
                                {{ artist.name }}
                            </li>
                        </ul>
                    </template>
                </Column>
                <Column header="Image">
                    <template #body="slotProps">
                        <img :src=slotProps.data.image :alt="slotProps.data.image" class="rounded" style="width: 64px" />
                    </template>
                </Column>
                <Column field="sound_link" header="Sound">
                    <template #body="slotProps">
                        <audio v-if="slotProps.data.sound_link" controls>
                            <source :src="slotProps.data.sound_link" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                        <span v-else>No sound</span>
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditSong(slotProps.data, slotProps.index)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteSong(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="songDialog" :style="{ width: '450px' }" header="Song Details" :modal="true">
                <div class="flex flex-col gap-6">
                    <!--                <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block m-auto pb-4" />-->
                    <div>
                        <label for="title" class="block font-bold mb-3">Title</label>
                        <InputText id="title" v-model.trim="newSong.title" required="true" autofocus :invalid="submitted && !newSong.title" fluid />
                        <small v-if="submitted && !newSong.title" class="text-red-500">Title is required.</small>
                    </div>
                    <div>
                        <label for="artists" class="block font-bold mb-3">Artist</label>
                        <MultiSelect id="artists" v-model="newSong.artistsId" :options="artists"
                            optionLabel="label" optionValue="value" placeholder="Select Artists" display="chip" fluid filter />
                    </div>
                    <div>
                        <label for="file" class="block font-bold mb-3">Sound file link</label>
                        <InputText id="file" v-model.trim="newSong.sound_link" required="true" autofocus :invalid="submitted && !newSong.sound_link" fluid />
                    </div>
                    <div>
                        <label for="image" class="block font-bold mb-3">Image Link</label>
                        <InputText id="image" v-model="newSong.image" required="true" fluid />
                        <div class="card flex justify-center">
                            <Image :src=newSong.image alt="Image" width="250" preview />
                        </div>

                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="hideEditDialog" />
                    <Button v-if="newSong.id" label="Save" icon="pi pi-check" @click="editSong(newSong.id)" />
                    <Button v-if="!newSong.id" label="Create" icon="pi pi-check" @click="createSong()" />
                </template>
            </Dialog>
            <Dialog v-model:visible="deleteSongDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span v-if="newSong"
                    >Are you sure you want to delete <b>{{ newSong.title }}</b
                    >?</span
                    >
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="deleteSongDialog = false" />
                    <Button label="Yes" icon="pi pi-check" @click="deleteSong(newSong.id)" />
                </template>
            </Dialog>
        </div>
    </div>
</template>
