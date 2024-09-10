<script setup>
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import api from '@/layout/api/api';

const toast = useToast();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);

const rowIndex = ref();
const artistDialog = ref(false);
const deleteArtistDialog = ref(false);
const artists = ref();
const artist = ref({});

// Get list of all artists (to render the table)
const getArtists = async () => {
    await api.get('/artists')
        .then((response) => {
            artists.value = response.data.result;
        });
}

// Open dialog for adding new artist
function openNew() {
    artist.value = {};
    submitted.value = false;
    artistDialog.value = true;
}

// Call API for creating new artist
async function createArtist() {
    submitted.value = true;
    await api.post(`/artists`, {
        name: artist.value.name,
        gender: artist.value.gender,
        yob: artist.value.yob,
        image: artist.value.image,
    }).then(() => {
        artists.value.push(artist.value);
        artist.value = {};
        artistDialog.value = false;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Artist created', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'There is an error in creating artist', life: 3000 });
    });
}

// Open dialog for editting artist
function openEditArtist(curr_artist, index) {
    artist.value = { ...curr_artist };
    artistDialog.value = true;
    rowIndex.value = index;
}

function hideEditDialog() {
    artistDialog.value = false;
    submitted.value = false;
}

// Call API for editting artist
async function editArtist(id) {
    await api.put(`/artists/${id}`, {
        name: artist.value.name,
        gender: artist.value.gender,
        yob: artist.value.yob,
        image: artist.value.image
    }).then(() => {
        artists.value[rowIndex.value] = artist.value;
        artistDialog.value = false;
        artist.value = {};
        submitted.value = true;
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Artist updated', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'There is an error in updating', life: 3000 });
    });
}

function confirmDeleteArtist(curr_artist) {
    artist.value = curr_artist;
    deleteArtistDialog.value = true;
}

// Call API to deleting artist
async function deleteArtist(id) {
    await api.delete(`/artists/${id}`)
    .then(() => {
        artists.value = artists.value.filter((val) => val.id !== artist.value.id);
        deleteArtistDialog.value = false;
        artist.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Artist deleted', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'There is an error in deleting', life: 3000 });
    })
}

onMounted(() => {
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

                <template #end>
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable :value="artists" :paginator="true" :rows="10" :filters="filters" data-key="id">
                <Column field="name" header="Name" sortable=""></Column>
<!--                <Column header="Image">-->
<!--                    <template #body="slotProps">-->
<!--                        <img :src=slotProps.data.image :alt="slotProps.data.image" class="rounded" style="width: 64px" />-->
<!--                    </template>-->
<!--                </Column>-->
                <Column field="gender" header="Gender"></Column>
                <Column field="yob" header="YOB"></Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditArtist(slotProps.data, slotProps.index)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteArtist(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="artistDialog" :style="{ width: '450px' }" header="Artist Details" :modal="true">
                <div class="flex flex-col gap-6">
                    <!--                <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block m-auto pb-4" />-->
                    <div>
                        <label for="name" class="block font-bold mb-3">Name</label>
                        <InputText id="name" v-model.trim="artist.name" required="true" autofocus :invalid="submitted && !artist.name" fluid />
                        <small v-if="submitted && !artist.name" class="text-red-500">Name is required.</small>
                    </div>
                    <div>
                        <label for="gender" class="block font-bold mb-3">Gender</label>
                        <div class="flex flex-wrap gap-24">
                            <div class="flex align-items-center">
                                <RadioButton v-model="artist.gender" inputId="male" name="Male" value="Male" />
                                <label for="male" class="ml-2">Male</label>
                            </div>
                            <div class="flex align-items-center">
                                <RadioButton v-model="artist.gender" inputId="female" name="Female" value="Female" />
                                <label for="female" class="ml-2">Female</label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label for="yob" class="block font-bold mb-3">YOB</label>
                        <InputText id="yob" v-model="artist.yob" required="true" fluid />
                    </div>
                    <div>
                        <label for="image" class="block font-bold mb-3">Image Link</label>
                        <InputText id="image" v-model="artist.image" required="true" fluid />
                        <div class="card flex justify-center">
                            <Image :src=artist.image alt="Image" width="250" preview />
                        </div>
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" icon="pi pi-times" text @click="hideEditDialog" />
                    <Button v-if="artist.id" label="Save" icon="pi pi-check" @click="editArtist(artist.id)" />
                    <Button v-if="!artist.id" label="Create" icon="pi pi-check" @click="createArtist()" />
                </template>
            </Dialog>
            <Dialog v-model:visible="deleteArtistDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="flex items-center gap-4">
                    <i class="pi pi-exclamation-triangle !text-3xl" />
                    <span v-if="artist"
                    >Are you sure you want to delete <b>{{ artist.name }}</b
                    >?</span
                    >
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="deleteArtistDialog = false" />
                    <Button label="Yes" icon="pi pi-check" @click="deleteArtist(artist.id)" />
                </template>
            </Dialog>

<!--            <DataTable-->
<!--                ref="dt"-->
<!--                v-model:selection="selectedProducts"-->
<!--                :value="products"-->
<!--                dataKey="id"-->
<!--                :paginator="true"-->
<!--                :rows="10"-->
<!--                :filters="filters"-->
<!--                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"-->
<!--                :rowsPerPageOptions="[5, 10, 25]"-->
<!--                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"-->
<!--            >-->
<!--                <template #header>-->
<!--                    <div class="flex flex-wrap gap-2 items-center justify-between">-->
<!--                        <h4 class="m-0">Manage Products</h4>-->
<!--                        <IconField>-->
<!--                            <InputIcon>-->
<!--                                <i class="pi pi-search" />-->
<!--                            </InputIcon>-->
<!--                            <InputText v-model="filters['global'].value" placeholder="Search..." />-->
<!--                        </IconField>-->
<!--                    </div>-->
<!--                </template>-->

<!--                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>-->
<!--                <Column field="code" header="Code" sortable style="min-width: 12rem"></Column>-->
<!--                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>-->
<!--                <Column header="Image">-->
<!--                    <template #body="slotProps">-->
<!--                        <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="rounded" style="width: 64px" />-->
<!--                    </template>-->
<!--                </Column>-->
<!--                <Column field="price" header="Price" sortable style="min-width: 8rem">-->
<!--                    <template #body="slotProps">-->
<!--                        {{ formatCurrency(slotProps.data.price) }}-->
<!--                    </template>-->
<!--                </Column>-->
<!--                <Column field="category" header="Category" sortable style="min-width: 10rem"></Column>-->
<!--                <Column field="rating" header="Reviews" sortable style="min-width: 12rem">-->
<!--                    <template #body="slotProps">-->
<!--                        <Rating :modelValue="slotProps.data.rating" :readonly="true" />-->
<!--                    </template>-->
<!--                </Column>-->
<!--                <Column field="inventoryStatus" header="Status" sortable style="min-width: 12rem">-->
<!--                    <template #body="slotProps">-->
<!--                        <Tag :value="slotProps.data.inventoryStatus" :severity="getStatusLabel(slotProps.data.inventoryStatus)" />-->
<!--                    </template>-->
<!--                </Column>-->
<!--                <Column :exportable="false" style="min-width: 12rem">-->
<!--                    <template #body="slotProps">-->
<!--                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />-->
<!--                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />-->
<!--                    </template>-->
<!--                </Column>-->
<!--            </DataTable>-->
        </div>

<!--        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Artists Details" :modal="true">-->
<!--            <div class="flex flex-col gap-6">-->
<!--&lt;!&ndash;                <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block m-auto pb-4" />&ndash;&gt;-->
<!--                <div>-->
<!--                    <label for="name" class="block font-bold mb-3">Name</label>-->
<!--                    <InputText id="name" v-model.trim="product.name" required="true" autofocus :invalid="submitted && !product.name" fluid />-->
<!--                    <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <label for="dob" class="block font-bold mb-3">DOB</label>-->
<!--                    <InputText id="dob" v-model="product.description" required="true" fluid />-->
<!--                </div>-->
<!--            </div>-->

<!--            <template #footer>-->
<!--                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />-->
<!--                <Button label="Save" icon="pi pi-check" @click="saveProduct" />-->
<!--            </template>-->
<!--        </Dialog>-->

<!--        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">-->
<!--            <div class="flex items-center gap-4">-->
<!--                <i class="pi pi-exclamation-triangle !text-3xl" />-->
<!--                <span v-if="product"-->
<!--                >Are you sure you want to delete <b>{{ product.name }}</b-->
<!--                >?</span-->
<!--                >-->
<!--            </div>-->
<!--            <template #footer>-->
<!--                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />-->
<!--                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />-->
<!--            </template>-->
<!--        </Dialog>-->

<!--        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">-->
<!--            <div class="flex items-center gap-4">-->
<!--                <i class="pi pi-exclamation-triangle !text-3xl" />-->
<!--                <span v-if="product">Are you sure you want to delete the selected products?</span>-->
<!--            </div>-->
<!--            <template #footer>-->
<!--                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />-->
<!--                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />-->
<!--            </template>-->
<!--        </Dialog>-->
    </div>
</template>
