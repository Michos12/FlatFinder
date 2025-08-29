import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Login } from './login/login';
import { Register } from './register/register';
import { Profile } from './profile/profile';
import { MyFlats } from './my-flats/my-flats';
import { Favorites } from './favorites/favorites';
import { NewFlat } from './new-flat/new-flat';
import { FlatView } from './flat-view/flat-view';
import { Input } from '@angular/core';
import { AllUsers } from './all-users/all-users';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'login', component:Login },
    { path: 'register', component:Register },
    { path: 'profile', component:Profile },
    { path: 'users', component: AllUsers },
    { path: 'favorites', component: Favorites },
    { path: 'my-flats', component: MyFlats },
    { path: 'new-flat', component: NewFlat },
    { path: `flat-view/:id`, component: FlatView },
    { path: '**', redirectTo: '' }
    
]