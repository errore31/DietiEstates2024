import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Advertisement } from './pages/advertisement/advertisement';
import { Agency } from './pages/agency/agency';
import { CreateAdvertisement } from './pages/create-advertisement/create-advertisement';

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
        path: 'properties/create',
        component: CreateAdvertisement,
        title: 'DietiEstate2425 - Create Advertisement'
    }

];
