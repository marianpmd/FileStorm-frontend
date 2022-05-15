import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserInfo} from "../../../datamodel/UserInfo";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../service/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {snackErrorConfig} from "../../../utils/UploadState";

@Component({
  selector: 'app-storage-assignment-dialog',
  templateUrl: './storage-assignment-dialog.component.html',
  styleUrls: ['./storage-assignment-dialog.component.scss']
})
export class StorageAssignmentDialogComponent implements OnInit {
  amount: FormControl = new FormControl('', [Validators.required]);
  description: FormControl = new FormControl('', [Validators.required]);
  formGroup: FormGroup = new FormGroup({
    amount: this.amount,
    description: this.description
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserInfo,
    private userService: AuthService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<StorageAssignmentDialogComponent>
  ) {
  }

  ngOnInit(): void {

  }

  onSend() {
    if (this.amount && this.description)
      this.userService.assignToUser(this.data, this.amount.value, this.description.value)
        .subscribe({
          next: value => {
            console.log(value);
            this.dialogRef.close(value);
          },
          error: err => {
            this.snackBar.open(err.error.message, "x", snackErrorConfig());
          }
        });
  }
}
