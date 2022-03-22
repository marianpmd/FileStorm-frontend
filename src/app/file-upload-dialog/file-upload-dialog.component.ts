import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent implements OnInit {

  allFiles: File[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data : NgxFileDropEntry[]
  ) { }

  ngOnInit(): void {
    this.data.forEach(item=>{
      let file = item.fileEntry as FileSystemFileEntry;
      file.file(theFile=>{
        this.allFiles.push(theFile);
      })
    })

  }

}
