import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Login } from './login/login';
import { Register } from './register/register';
import { Profile } from './profile/profile';

export const routes: Routes = [
    { path: '', component: HomePage },
    { path: 'login', component:Login},
    {path: 'register', component:Register},
    {path: 'profile', component:Profile}
];
