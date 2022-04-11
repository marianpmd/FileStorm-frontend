import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-file-update-dialog',
  templateUrl: './file-update-dialog.component.html',
  styleUrls: ['./file-update-dialog.component.scss']
})
export class FileUpdateDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:File
  ) { }

  ngOnInit(): void {
  }

}
