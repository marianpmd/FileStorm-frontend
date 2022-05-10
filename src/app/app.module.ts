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
import {FileUploadDialogComponent} from './dialogs/file-upload-dialog/file-upload-dialog.component';
import {UploadLoadingDialogComponent} from './dialogs/upload-loading-dialog/upload-loading-dialog.component';
import {JWT_OPTIONS, JwtHelperService} from "@auth0/angular-jwt";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {FileItemDialogComponent} from './dialogs/file-item-dialog/file-item-dialog.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {FileUpdateDialogComponent} from './dialogs/file-update-dialog/file-update-dialog.component';
import {FiltersDialogComponent} from './dialogs/filters-dialog/filters-dialog.component';
import {MatRadioModule} from "@angular/material/radio";
import {NgxScrollTopModule} from 'ngx-scrolltop';
import {GoTopButtonModule} from "ng-go-top-button";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {MatMenuModule} from "@angular/material/menu";
import {DirectoryCreateDialogComponent} from './dialogs/directory-create-dialog/directory-create-dialog.component';
import {MatBadgeModule} from "@angular/material/badge";
import { DirectoryDeleteDialogComponent } from './dialogs/directory-delete-dialog/directory-delete-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    FileUploadDialogComponent,
    UploadLoadingDialogComponent,
    FileItemDialogComponent,
    FileUpdateDialogComponent,
    FiltersDialogComponent,
    DirectoryCreateDialogComponent,
    DirectoryDeleteDialogComponent,
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
        NgxFileDropModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        MatAutocompleteModule,
        MatSelectModule,
        MatRadioModule,
        NgxScrollTopModule,
        GoTopButtonModule,
        PdfViewerModule,
        MatMenuModule,
        MatBadgeModule
    ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true},
    {provide: JWT_OPTIONS, useValue: JWT_OPTIONS}, JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
