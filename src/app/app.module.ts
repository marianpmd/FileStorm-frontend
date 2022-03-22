import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login/login.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatRippleModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RegisterComponent} from "./register/register.component";
import {MatDialogModule} from "@angular/material/dialog";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatFileUploadModule} from "angular-material-fileupload";
import {NgxFileDropModule} from "ngx-file-drop";
import {XhrInterceptor} from "../interceptors/xhr.interceptor";
import { FileUploadDialogComponent } from './file-upload-dialog/file-upload-dialog.component';
import { UploadLoadingDialogComponent } from './upload-loading-dialog/upload-loading-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    FileUploadDialogComponent,
    UploadLoadingDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatIconModule,
    ReactiveFormsModule,
    MatListModule,
    FormsModule,
    MatCardModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSidenavModule,
    ScrollingModule,
    InfiniteScrollModule,
    MatProgressBarModule,
    MatFileUploadModule,
    NgxFileDropModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
