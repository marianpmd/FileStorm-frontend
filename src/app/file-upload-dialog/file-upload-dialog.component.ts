import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent implements OnInit {

  allFiles: File[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: File[]
  ) {
  }

  ngOnInit(): void {
    this.allFiles = [...this.data];
    // this.data.forEach(item => {
    //   // let file = item.fileEntry as FileSystemFileEntry;
    //   file.file(theFile => {
    //     this.allFiles.push(theFile);
    //   })
    // })

  }

  computeFileSize(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
