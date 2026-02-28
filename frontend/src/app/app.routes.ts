import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Advertisement } from './pages/advertisement/advertisement';
import { Agency } from './pages/agency/agency';
import { Searches } from './pages/searches/searches';
import { CreateAdvertisement } from './pages/create-advertisement/create-advertisement';
import { Account } from './pages/account/account';
import { Register } from './pages/register/register';
import { authorizationAgencyGuard } from './guard/authorizationAgency-guard';
import { authorizationGuard } from './guard/authorization-guard';

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
        path: 'searches',
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
        path: 'account',
        component: Account,
        title: 'DietiEstate2425 - Account',
        canActivate: [authorizationGuard],
    }

];
