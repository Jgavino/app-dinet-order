import { Routes } from '@angular/router';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderCreateComponent } from './order-create/order-create.component';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: OrderListComponent,
  },
  {
    path: 'edit/:id',
    component: OrderEditComponent,
  },
  {
    path: 'create',
    component: OrderCreateComponent,
  },
];
