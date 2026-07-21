import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'carta',
    loadComponent: () =>
      import('./pages/menu/menu.component').then(m => m.MenuComponent)
  },
  {
    path: 'reservar',
    loadComponent: () =>
      import('./pages/reservation/reservation.component').then(m => m.ReservationComponent)
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin/reservas',
    loadComponent: () =>
      import('./pages/admin/admin-reservas/admin-reservas.component').then(m => m.AdminReservasComponent)
  },
  {
    path: 'admin/menu',
    loadComponent: () =>
      import('./pages/admin/admin-menu/admin-menu.component').then(m => m.AdminMenuComponent)
  },
  {
    path: 'admin/eventos',
    loadComponent: () =>
      import('./pages/admin/admin-eventos/admin-eventos.component').then(m => m.AdminEventosComponent)
  },
  {
    path: 'admin/informacion',
    loadComponent: () =>
      import('./pages/admin/admin-informacion/admin-informacion.component').then(m => m.AdminInformacionComponent)
  },
  { path: '**', redirectTo: '' }
];
