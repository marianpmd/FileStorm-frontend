import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthGuardService} from "../service/auth-guard.service";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {AdminGuard} from "../service/admin.guard";

const routes: Routes = [
  {
    path : "login",
    component : LoginComponent
  },
  {
    path : "dashboard",
    component : DashboardComponent,
    canActivate: [AuthGuardService],
    children : [
      {
        path:"admin",
        component : AdminDashboardComponent,
        canActivate:[AdminGuard]
      }
    ]
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
