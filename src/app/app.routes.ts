import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.routes').then((module: any) => module.AUTH_ROUTES),
  },
  {
    path: 'orders',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/orders/orders.routes').then(
        (module: any) => module.ORDERS_ROUTES
      ),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
