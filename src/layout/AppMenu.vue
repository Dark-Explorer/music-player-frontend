<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/admin/' },
            { label: 'Artist', icon: 'pi pi-fw pi-pencil', to: '/admin/artists' },
            { label: 'User', icon: 'pi pi-fw pi-users', to: '/admin/users' },
            { label: 'Song', icon: 'pi pi-fw pi-play', to: '/admin/songs' },
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
