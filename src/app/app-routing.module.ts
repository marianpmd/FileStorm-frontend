import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthGuardService} from "../service/auth-guard.service";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {AdminGuard} from "../service/admin.guard";
import {PublicResourceComponent} from "./public-resource/public-resource.component";

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
    path : "public/:id",
    component: PublicResourceComponent
  },
  {
    path : "",
    redirectTo : "/dashboard",
    pathMatch : "full"
  },
  {
    path : "**",
    redirectTo : "/dashboard",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
