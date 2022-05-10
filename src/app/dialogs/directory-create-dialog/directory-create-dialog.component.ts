import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-directory-create-dialog',
  templateUrl: './directory-create-dialog.component.html',
  styleUrls: ['./directory-create-dialog.component.scss']
})
export class DirectoryCreateDialogComponent implements OnInit {
  dirName!: string;

  constructor(private dialogRef: MatDialogRef<DirectoryCreateDialogComponent>) {
  }

  ngOnInit(): void {

  }

  onSubmit() {
    this.dialogRef.close(this.dirName);
  }
}
