import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

/**
 * Todo lo que no sea login o registro exige sesión. Antes ninguna ruta
 * estaba protegida: bastaba escribir /users en la barra de direcciones.
 * Se cargan de forma diferida para no arrastrar toda la app en el bundle
 * inicial.
 */
export const routes: Routes = [
  {
    path: 'login',
    title: 'Log in | FlatFinder',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    title: 'Sign up | FlatFinder',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'Flats | FlatFinder',
        loadComponent: () =>
          import('./features/flats/flat-list/flat-list').then((m) => m.FlatList),
      },
      {
        path: 'flats/new',
        title: 'List a flat | FlatFinder',
        loadComponent: () =>
          import('./features/flats/flat-form/flat-form').then((m) => m.FlatForm),
      },
      {
        path: 'flats/:id',
        title: 'Flat details | FlatFinder',
        loadComponent: () =>
          import('./features/flats/flat-detail/flat-detail').then((m) => m.FlatDetail),
      },
      {
        path: 'my-flats',
        title: 'My flats | FlatFinder',
        loadComponent: () => import('./features/flats/my-flats/my-flats').then((m) => m.MyFlats),
      },
      {
        path: 'favorites',
        title: 'Favourites | FlatFinder',
        loadComponent: () =>
          import('./features/flats/favorites/favorites').then((m) => m.Favorites),
      },
      {
        path: 'profile',
        title: 'My profile | FlatFinder',
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'users',
        title: 'Users | FlatFinder',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/users/user-list/user-list').then((m) => m.UserList),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
