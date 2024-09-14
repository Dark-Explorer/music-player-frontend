<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/layout/api/api';

const router  = useRoute();
const toast = useToast();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

const rowIndex = ref();
const playlistDialog = ref(false);
const deletePlaylistDialog = ref(false);
const playlists = ref();
const playlist = ref({});

const getPlaylists = async () => {
    await api.get('/playlists/myPlaylists')
        .then((response) => {
            playlists.value = response.data.result;
        });
}

function openNew() {
    playlist.value = {};
    submitted.value = false;
    playlistDialog.value = true;
}

async function createPlaylist() {
    submitted.value = true;
    await api.post(`/playlists`, {
        name: playlist.value.name,
    }).then(() => {
        playlists.value.push(playlist.value);
        playlist.value = {};
        playlistDialog.value = false;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Playlist created', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'There is an error in creating playlist', life: 3000 });
    });
}

function openEditPlaylist(curr_artist, index) {
    playlist.value = { ...curr_artist };
    playlistDialog.value = true;
    rowIndex.value = index;
}

function hideEditDialog() {
    playlistDialog.value = false;
    submitted.value = false;
}

// Call API for editing artist
async function editPlaylist(id) {
    await api.put(`/playlists/${id}`, {
        name: playlist.value.name,
    }).then(() => {
        playlists.value[rowIndex.value] = playlist.value;
        playlistDialog.value = false;
        playlist.value = {};
        submitted.value = true;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Playlist updated', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'There is an error in updating', life: 3000 });
    });
}

function confirmDeletePlaylist(curr_artist) {
    playlist.value = curr_artist;
    deletePlaylistDialog.value = true;
}

async function deletePlaylist(id) {
    await api.delete(`/playlists/${id}`)
        .then(() => {
            playlists.value = playlists.value.filter((val) => val.id !== playlist.value.id);
            deletePlaylistDialog.value = false;
            playlist.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Playlist deleted', life: 3000 });
        }).catch(() => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'There is an error in deleting, please reload the page', life: 3000 });
        })
}

onMounted(() => {
    getPlaylists();
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

            <DataTable :value="playlists" :paginator="true" :rows="10" :filters="filters" data-key="id">
                <Column field="name" header="Name" sortable>
                    <template #body="slotProps">
                        <router-link :to="`/playlist/${slotProps.data.id}`">
                            {{ slotProps.data.name }}
                        </router-link>
                    </template>
                </Column>

                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditPlaylist(slotProps.data, slotProps.index)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeletePlaylist(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="playlistDialog" :style="{ width: '450px' }" header="Playlist Details" :modal="true">
                <div class="flex flex-col gap-6">
                    <div>
                        <label for="name" class="block font-bold mb-3">Name</label>
                        <InputText id="name" v-model.trim="playlist.name" required="true" autofocus :invalid="submitted && !playlist.name" fluid />
                        <small v-if="submitted && !playlist.name" class="text-red-500">Name is required.</small>
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="hideEditDialog" />
                    <Button v-if="playlist.id" label="Save" icon="pi pi-check" @click="editPlaylist(playlist.id)" />
                    <Button v-if="!playlist.id" label="Create" icon="pi pi-check" @click="createPlaylist()" />
                </template>
            </Dialog>
            <Dialog v-model:visible="deletePlaylistDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span v-if="playlist"
                    >Are you sure you want to delete <b>{{ playlist.name }}</b
                    >?</span
                    >
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="deletePlaylistDialog = false" />
                    <Button label="Yes" icon="pi pi-check" @click="deletePlaylist(playlist.id)" />
                </template>
            </Dialog>
        </div>
    </div>
</template>
