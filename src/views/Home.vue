<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ProductService } from '@/service/ProductService';
import { onMounted, ref, watch } from 'vue';
import AuthService from '@/layout/api/auth'
import AccessDenied from '@/views/pages/auth/Access.vue'

onMounted(() => {
    ProductService.getProductsSmall().then((data) => (products.value = data.slice(0, 9)));
})

const products = ref();
const items = ref([
    {
        label: 'Anh trai vượt ngàn chông gai',
        image: 'https://cdn-media.sforum.vn/storage/app/media/ctv_seo10/anh-trai-vuot-ngan-chong-gai-thumb.jpg'
    },
    {
        label: 'Sơn Tùng MTP',
        image: 'https://i.ytimg.com/vi/abPmZCZZrFA/maxresdefault.jpg'
    },
    {
        label: 'World Cup Songs',
        image: 'https://st1.latestly.com/wp-content/uploads/2022/11/FIFA-World-Cup-2022-Songs-and-Anthems.jpg'
    },
    {
        label: 'Euro Songs',
        image: 'https://thesportzplanet.com/wp-content/uploads/2024/06/UEFA-EURO-2024-ANTHEM.png'
    },
    {
        label: 'US-UK',
        image: 'https://www.levisstadium.com/wp-content/uploads/2022/11/TS23_Outdoor_OSD_1920x1080_0729SantaClaraCA.jpg'
    },
    {
        label: 'Trending',
        image: 'https://avatar-ex-swe.nixcdn.com/playlist/share/2019/11/18/6/6/d/b/1574060626155.jpg'
    },
])
const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);

</script>

<template>
    <div class="card">
        <Carousel :value="items" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions">
            <template #item="slotProps">
                <div class="border border-surface-200 dark:border-surface-700 rounded m-2  p-4">
                    <div class="mb-4">
                        <div class="relative mx-auto">
                            <img :src="slotProps.data.image" alt="Image" class="w-full rounded" />
                            <Tag :value="slotProps.data.label" class="absolute" style="left:5px; top: 5px"/>
                        </div>
                    </div>
                    <div class="mb-4 font-medium">{{ slotProps.data.label }}</div>
                </div>
            </template>
        </Carousel>
    </div>
</template>
