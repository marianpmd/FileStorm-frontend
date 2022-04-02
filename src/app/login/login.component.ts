import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {RegisterComponent} from "../register/register.component";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  password: FormControl = new FormControl('', [Validators.required]);

  formGroup: FormGroup = new FormGroup({
    username: this.email,
    password: this.password
  });
  isLoading: boolean = false;

  constructor(private auth: AuthService,
              protected snackBar: MatSnackBar,
              private router: Router,
              private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
  }

  onLogin() {
    this.isLoading = true;
    if (this.email.value && this.password.value) {
      let encodedPassword = btoa(this.password.value);

      this.auth.onLogin(this.email.value, encodedPassword)
        .subscribe({
          next: result => {
            let body = result.body;
            let token = body!.accessToken;

            localStorage.setItem("ocl-jwt", token);

            this.isLoading = false;

            this.router.navigate(['/dashboard']);
          },
          error: err => {
            console.log("Error , showing snackbar")
            this.snackBar.open("Login has failed!", "Close", {
              duration: 2000,
              panelClass: ['mat-toolbar', 'mat-warn']
            })
            this.isLoading = false;
          }
        });

    }
  }

  onRegister() {
    this.dialog.open(RegisterComponent, {})
  }
}
