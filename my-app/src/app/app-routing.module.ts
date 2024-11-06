import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { UserCreateOrderComponent } from './user-create-order/user-create-order.component';
import { UserOrderDetailComponent } from './user-order-detail/user-order-detail.component';
import { OrderListComponent } from './user-order-list/order-list.component';
import { CourierHomepageComponent} from "./courier-homepage/courier-homepage.component";
import { CourierOrderListComponent } from './courier-order-list/courier-order-list.component';
import { CourierOrdersComponent } from './courier-orders/courier-orders.component';


const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'order', component: UserCreateOrderComponent },
    { path: 'user-home', component: UserHomepageComponent },
    { path: 'user-order-list', component: OrderListComponent },
    { path: 'user-order-details', component: UserOrderDetailComponent},
    { path: 'courier-home', component:  CourierHomepageComponent },
    { path: 'courier-order-list', component: CourierOrderListComponent},
    { path: 'courier-orders', component: CourierOrdersComponent}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
