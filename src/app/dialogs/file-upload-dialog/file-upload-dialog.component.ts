import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {computeFileSize} from "../../../utils/Common";

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent implements OnInit {

  allFiles: File[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: File[],
  ) {
  }

  ngOnInit(): void {
    this.allFiles = [...this.data];
  }

  computeFileSize(size: number) {
    return computeFileSize(size);
  }
}

