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
                    path: 'uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: 'uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: 'uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: 'uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: 'uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: 'uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: 'uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: 'uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: 'uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: 'uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: 'uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: 'uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: 'uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: 'uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: 'uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: 'pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: 'pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
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
                {
                    path: 'home',
                    name: 'home',
                    component: () => import('@/views/Home.vue')
                },
                {
                    path: 'documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
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
    const publicPages = ['/auth/login', '/auth/signup', '/home'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = await AuthService.checkTokenValidity();

    if (authRequired && !loggedIn) {
        next('/auth/login');
    } else {
        next();
    }
});

export default finalRouter;
