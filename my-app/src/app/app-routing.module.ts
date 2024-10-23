// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
    { path: '', redirectTo: '/register', pathMatch: 'full' }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],  // Importing the router
    exports: [RouterModule]  // Exporting to use in AppModule
})
export class AppRoutingModule { }
