import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import AuthService from '@/layout/api/auth'
import CustomerLayout from '@/layout/CustomerLayout.vue';
import { all } from 'axios';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/admin',
            component: AppLayout,
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requireAuth: true }
                },
                {
                    path: 'artists',
                    name: 'artists',
                    component: () => import('@/views/AdminArtist.vue')
                },
                {
                    path: 'songs',
                    name: 'songs',
                    component: () => import('@/views/AdminSong.vue')
                },
                {
                    path: 'users',
                    name: 'users',
                    component: () => import('@/views/AdminUser.vue')
                },
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/signup',
            name: 'signup',
            component: () => import('@/views/pages/auth/SignUp.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

const customerRouter = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: CustomerLayout,
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/Home.vue'),
                },
                {
                    path: '/artists',
                    name: 'artist',
                    component: () => import('@/views/Artist.vue')
                },
                {
                    path: '/artist/:id',
                    name: 'artistDetail',
                    component: () => import('@/views/ArtistDetail.vue')
                },
                {
                    path: '/song/:id',
                    name: 'songDetail',
                    component: () => import('@/views/Song.vue')
                },
                {
                    path: '/playlists',
                    name: 'playlists',
                    component: () => import('@/views/Playlist.vue')
                },
                {
                    path: '/playlist/:id',
                    name: 'singlePlaylist',
                    component: () => import('@/views/SinglePlaylist.vue')
                },
                {
                    path: '/info',
                    name: 'info',
                    component: () => import('@/views/UserInfo.vue')
                }
            ]
        },
    ]
});

const allRoutes = [...router.options.routes, ...customerRouter.options.routes];

const finalRouter = createRouter({
    history: createWebHistory(),
    routes: allRoutes,
});

finalRouter.beforeEach(async (to, from, next) => {
    const publicPages = ['/auth/login', '/auth/signup', '/home', '/artist', '/artists', '/song'];
    const authRequired = !publicPages.some(page => to.path.startsWith(page));
    const loggedIn = await AuthService.checkTokenValidity();

    if (authRequired && !loggedIn) {
        next('/auth/login');
    } else {
        next();
    }
});

export default finalRouter;
