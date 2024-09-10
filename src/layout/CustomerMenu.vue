<script setup>
import { ref } from 'vue';

import CustomerMenuItem from '@/layout/CustomerMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/home' },
            { label: 'Artist', icon: 'pi pi-fw pi-pencil', to: '/artists' },
            { label: 'My Playlist', icon: 'pi pi-fw pi-list', to: '/playlists' },
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <customer-menu-item v-if="!item.separator" :item="item" :index="i"></customer-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
