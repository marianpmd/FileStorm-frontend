import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FileService} from "../../service/file.service";
import {HttpEventType, HttpStatusCode} from "@angular/common/http";
import {FileUploadInfo} from "../../datamodel/FileUploadInfo";
import {UploadState} from "../../utils/UploadState";
import {UploadStateService} from "../../service/upload-state.service";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {FileUpdateDialogComponent} from "../file-update-dialog/file-update-dialog.component";

@Component({
  selector: 'app-upload-loading-dialog',
  templateUrl: './upload-loading-dialog.component.html',
  styleUrls: ['./upload-loading-dialog.component.scss']
})
export class UploadLoadingDialogComponent implements OnInit {

  progressBarMode: ProgressBarMode = 'determinate';
  public allFiles: Map<File, FileUploadInfo> = new Map<File, FileUploadInfo>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {files:File[], shouldUpdate:boolean},
    private dialogRef: MatDialogRef<UploadLoadingDialogComponent>,
    private fileService: FileService,
    private uploadStateService: UploadStateService,
  ) {
  }

  ngOnInit(): void {
    this.data.files.forEach(actualFile => {
      this.fileService.uploadFile(actualFile,this.data.shouldUpdate)
        .subscribe(
          (next: any) => {
            this.progressBarMode = 'determinate';

            if (!this.allFiles.has(actualFile)) {
              this.allFiles.set(actualFile, {
                uploadState: UploadState.UPLOADING,
                progress: 0
              });
            } else {
              if (next.type === HttpEventType.UploadProgress) {
                let progress = Math.round(100 * next.loaded / next.total);
                if (progress === 100 && this.progressBarMode === 'determinate') {
                  this.progressBarMode = 'query';
                }
                this.allFiles.set(actualFile, {
                  uploadState: UploadState.UPLOADING,
                  progress: progress
                });
              } else if (next.type === HttpEventType.Response) {
                let fileUploadInfo = this.allFiles.get(actualFile);
                fileUploadInfo!.uploadState = UploadState.DONE;
                this.uploadStateService.setFileInfo(next.body);
              }
            }
          },
          error => {
            // if (error.status === HttpStatusCode.PreconditionFailed) {
            //   console.log("ERROR ON UPLOAD : ", error);
            //   this.dialog.open(FileUpdateDialogComponent,{
            //     hasBackdrop: true,
            //   })
            // }
          });
    })


  }

  isUploading(value: FileUploadInfo) {
    return value.uploadState === UploadState.UPLOADING;
  }

  isDone(value: FileUploadInfo) {
    return value.uploadState === UploadState.DONE;
  }
}
