import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Advertisement } from './pages/advertisement/advertisement';
import { Agency } from './pages/agency/agency';
import { Searches } from './pages/searches/searches';
import { CreateAdvertisement } from './pages/create-advertisement/create-advertisement';
import { Account } from './pages/account/account';
import { Register } from './pages/register/register';
import { Notifications } from './pages/notifications/notifications';
import { CreateAgencyRequest } from './pages/create-agency-request/create-agency-request';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { authorizationAgencyGuard } from './guard/authorizationAgency-guard';
import { authorizationGuard } from './guard/authorization-guard';
import { adminGuard } from './guard/admin-guard';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'DietiEstate2425 - Home'
    },
    {
        path: 'auth',
        component: Login,
        title: 'DietiEstate2425 - Login'
    },
    {
        path: 'register',
        component: Register,
        title: 'DietiEstate2425 - Register'
    },
    {
        path: 'agency-request',
        component: CreateAgencyRequest,
        title: 'DietiEstate2425 - Crea Agenzia'
    },
    {
        path: 'admin',
        component: AdminDashboard,
        title: 'DietiEstate2425 - Admin Dashboard',
        canActivate: [authorizationGuard, adminGuard]
    },
    {
        path: 'advertisement/:id',
        component: Advertisement,
        title: 'DietiEstate2425 - Advertisement'
    },
    {
        path: 'agency/:id',
        component: Agency,
        title: 'DietiEstate2425 - Agency'
    },
    {
        path: 'searches/:text',
        component: Searches,
        title: 'DietiEstate2425 - Searches',
    },
    {
        path: 'properties/create',
        component: CreateAdvertisement,
        title: 'DietiEstate2425 - Create Advertisement',
        canActivate: [authorizationGuard, authorizationAgencyGuard],
    },
    {
        path: 'properties/edit/:id',
        component: CreateAdvertisement,
        title: 'DietiEstate2425 - Edit Advertisement',
        canActivate: [authorizationGuard, authorizationAgencyGuard],
    },
    {
        path: 'account',
        component: Account,
        title: 'DietiEstate2425 - Account',
        canActivate: [authorizationGuard],
    },
    {
        path: 'notifications',
        component: Notifications,
        title: 'DietiEstate2425 - Notifiche',
        canActivate: [authorizationGuard],
    }

];
