import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {NgxFileDropEntry} from "ngx-file-drop";
import {FileService} from "../../service/file.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-upload-loading-dialog',
  templateUrl: './upload-loading-dialog.component.html',
  styleUrls: ['./upload-loading-dialog.component.scss']
})
export class UploadLoadingDialogComponent implements OnInit {

  public allFiles: Map<File, number> = new Map<File, number>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: NgxFileDropEntry[],
    private fileService: FileService
  ) {
  }

  ngOnInit(): void {

    this.data.forEach(ngxEntry => {
      let fileEntry = ngxEntry.fileEntry as FileSystemFileEntry;
      fileEntry.file(actualFile => {
        this.fileService.uploadFiles(actualFile)
          .subscribe(
            (next: any) => {


              console.log("Adding filedata to dialog")
              if (!this.allFiles.has(actualFile)){
                this.allFiles.set(actualFile, 0);
              }else {
                if (next.type === HttpEventType.UploadProgress) {
                  let progress = Math.round(100 * next.loaded / next.total);
                  this.allFiles.set(actualFile, progress);
                  console.log(progress);
                } else if (next.type instanceof HttpResponse) {
                  console.log("DONE with file ", actualFile.name);
                }
              }



              // if (next.type === HttpEventType.UploadProgress){
              //   let progress = Math.round(100 * next.loaded / next.total);
              //   fileInfo.progress = progress;
              //   console.log(progress);
              // }else if (next.type instanceof HttpResponse){
              //
              // }


            })
      })
    })


  }

}
