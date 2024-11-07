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
import { UserOrderListComponent } from './user-order-list/user-order-list.component';
import { CourierOrderListComponent } from './courier-order-list/courier-order-list.component';
import { CourierOrdersComponent } from './courier-orders/courier-orders.component';
import { CourierHomepageComponent } from './courier-homepage/courier-homepage.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { UserOrderDetailComponent } from './user-order-detail/user-order-detail.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { AdminHomepageComponent } from './admin-homepage/admin-homepage.component';
import { FooterComponent } from './footer/footer.component';
import { MainComponent } from './main/main.component';
import { CourierNavbarComponent } from './courier-navbar/courier-navbar.component';
import { UserNavbarComponent } from './user-navbar/user-navbar.component';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    UserCreateOrderComponent,
    UserOrderListComponent,
    CourierOrderListComponent,
    CourierOrdersComponent,
    UserHomepageComponent,
    UserOrderDetailComponent,
    LandingpageComponent,
    CourierHomepageComponent,
    AdminHomepageComponent,
    UserOrderListComponent,
    FooterComponent,
    MainComponent,
    CourierNavbarComponent,
    UserNavbarComponent,
    
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
