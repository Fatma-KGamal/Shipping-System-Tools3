// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserCreateOrderComponent } from './user-create-order/user-create-order.component';
import { OrderListComponent } from './user-order-list/order-list.component';
import { CourierOrderListComponent } from './courier-order-list/courier-order-list.component';
import { CourierOrdersComponent } from './courier-orders/courier-orders.component';
import { CourierHomepageComponent } from './courier-homepage/courier-homepage.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { UserOrderDetailComponent } from './user-order-detail/user-order-detail.component';
import { LandingpageComponent } from './landingpage/landingpage.component';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    UserCreateOrderComponent,
    OrderListComponent,
    CourierOrderListComponent,
    CourierOrdersComponent,
    UserHomepageComponent,
    UserOrderDetailComponent,
    LandingpageComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule, 

    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
