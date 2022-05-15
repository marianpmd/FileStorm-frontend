import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserInfo} from "../../../datamodel/UserInfo";
import {AuthService} from "../../../service/auth.service";
import {NotificationService} from "../../../service/notification.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {snackSuccessConfig} from "../../../utils/UploadState";
import {HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-storage-request-dialog',
  templateUrl: './storage-request-dialog.component.html',
  styleUrls: ['./storage-request-dialog.component.scss']
})
export class StorageRequestDialogComponent implements OnInit {
  description: FormControl = new FormControl('',[Validators.required,Validators.maxLength(45)]);
  preferredAmount: FormControl = new FormControl('' , [Validators.required]);
  formGroup: FormGroup = new FormGroup({
    description : this.description,
    preferredAmount: this.preferredAmount
  });
  selected!: string;

  constructor(@Inject(MAT_DIALOG_DATA)data : UserInfo,
              private userService : AuthService,
              private notificationService:NotificationService,
              private snackBar:MatSnackBar,
              private dialogRef:MatDialogRef<StorageRequestDialogComponent>
              ){

  }

  ngOnInit(): void {

  }

  onSend() {
    if (this.formGroup.invalid) return;

    this.notificationService.notifyAdmin({
      preferredAmount : this.preferredAmount.value,
      description : this.description.value
    }).subscribe(response=>{
      if (response.status === HttpStatusCode.Ok){
        this.snackBar.open("Admin was notified!","x",snackSuccessConfig());
        this.dialogRef.close();
      }
    })

  }
}
