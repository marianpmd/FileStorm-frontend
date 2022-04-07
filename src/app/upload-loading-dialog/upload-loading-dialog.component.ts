import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FileService} from "../../service/file.service";
import {HttpEventType} from "@angular/common/http";
import {FileUploadInfo} from "../../datamodel/FileUploadInfo";
import {UploadState} from "../../utils/UploadState";
import {UploadStateService} from "../../service/upload-state.service";
import {ProgressBarMode} from "@angular/material/progress-bar";

@Component({
  selector: 'app-upload-loading-dialog',
  templateUrl: './upload-loading-dialog.component.html',
  styleUrls: ['./upload-loading-dialog.component.scss']
})
export class UploadLoadingDialogComponent implements OnInit {

  progressBarMode: ProgressBarMode = 'indeterminate';
  public allFiles: Map<File, FileUploadInfo> = new Map<File, FileUploadInfo>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: File[],
    private dialogRef: MatDialogRef<UploadLoadingDialogComponent>,
    private fileService: FileService,
    private uploadStateService: UploadStateService
  ) {
  }

  ngOnInit(): void {
    this.data.forEach(actualFile => {
      this.fileService.uploadFiles(actualFile)
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
          })
    })


  }

  isUploading(value: FileUploadInfo) {
    return value.uploadState === UploadState.UPLOADING;
  }

  isDone(value: FileUploadInfo) {
    return value.uploadState === UploadState.DONE;
  }
}
