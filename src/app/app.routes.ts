// app-routing.module.ts - UPDATE
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { MenuComponent } from './components/menu/menu';
import { OrderComponent } from './order/order';
import { AboutComponent } from './about/about';
import { ContactComponent } from './contact/contact';
import { CartComponent } from './components/cart/cart';
import { PaymentComponent } from './components/payment/payment';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'order', component: OrderComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'cart', component: CartComponent },
  { path: 'payment', component: PaymentComponent }, // Remove :id and :amount from route
  { path: '**', redirectTo: '' }
];