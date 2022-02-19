import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthService} from "../service/auth.service";

const routes: Routes = [
  {
    path : "login",
    component : LoginComponent
  },
  {
    path : "dashboard",
    component : DashboardComponent,
    // canActivate: [AuthService]
  },
  {
    path : "",
    redirectTo : "dashboard",
    pathMatch : "full"
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
