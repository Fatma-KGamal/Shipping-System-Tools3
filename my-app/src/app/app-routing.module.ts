import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { UserCreateOrderComponent } from './user-create-order/user-create-order.component';
import { UserOrderDetailComponent } from './user-order-detail/user-order-detail.component';
import { UserOrderListComponent } from './user-order-list/user-order-list.component';
import { CourierHomepageComponent} from "./courier-homepage/courier-homepage.component";
import { CourierOrderListComponent } from './courier-order-list/courier-order-list.component';
import { CourierOrdersComponent } from './courier-orders/courier-orders.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { AdminHomepageComponent } from './admin-homepage/admin-homepage.component';
import { AdminOrderListComponent } from './admin-order-list/admin-order-list.component';
import { AdminOrderDetailComponent } from './admin-order-detail/admin-order-detail.component';



const routes: Routes = [
    { path: 'landingpage', component: LandingpageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'user-home', component: UserHomepageComponent },
    { path: 'create-order', component: UserCreateOrderComponent },
    { path: 'user-order-list', component: UserOrderListComponent },
    { path: 'user-order-detail/:id', component: UserOrderDetailComponent },
    { path: 'courier-home', component:  CourierHomepageComponent },
    { path: 'courier-order-list', component: CourierOrderListComponent},
    { path: 'courier-orders', component: CourierOrdersComponent},
    { path: 'admin-home', component: AdminHomepageComponent },
    { path: 'admin-order-list', component: AdminOrderListComponent },
    { path: 'admin-order-detail/:id', component: AdminOrderDetailComponent },
    { path: '', redirectTo: '/landingpage', pathMatch: 'full' },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
