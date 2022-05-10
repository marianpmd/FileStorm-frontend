import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FileService} from "../../../service/file.service";
import {HttpEventType} from "@angular/common/http";
import {FileUploadInfo} from "../../../datamodel/FileUploadInfo";
import {UploadState} from "../../../utils/UploadState";
import {UploadStateService} from "../../../service/upload-state.service";
import {ProgressBarMode} from "@angular/material/progress-bar";
import {FileType} from "../../../utils/FileType";

@Component({
  selector: 'app-upload-loading-dialog',
  templateUrl: './upload-loading-dialog.component.html',
  styleUrls: ['./upload-loading-dialog.component.scss']
})
export class UploadLoadingDialogComponent implements OnInit {

  progressBarMode: ProgressBarMode = 'determinate';
  public allFiles: Map<File, FileUploadInfo> = new Map<File, FileUploadInfo>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { files: File[], shouldUpdate: boolean, pathFromRoot: string[] },
    private dialogRef: MatDialogRef<UploadLoadingDialogComponent>,
    private fileService: FileService,
    private uploadStateService: UploadStateService,
  ) {
  }

  ngOnInit(): void {
    this.data.files.forEach(actualFile => {
      this.fileService.uploadFile(actualFile,this.data.pathFromRoot, this.data.shouldUpdate)
        .subscribe(
          (next: any) => {
            this.progressBarMode = 'determinate';

            if (!this.allFiles.has(actualFile)) {
              console.log("this a file ><D")
              this.allFiles.set(actualFile, {
                uploadState: UploadState.UPLOADING,
                progress: 0
              });
            } else {
              if (next.type === HttpEventType.UploadProgress) {
                let progress = Math.round(100 * next.loaded / next.total);
                console.log("progress : ", progress)
                console.log("bar state : ", this.progressBarMode)
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

                let fileInfo = next.body;
                if (fileInfo.fileType === FileType.IMAGE ||
                  fileInfo.fileType === FileType.VIDEO ||
                  fileInfo.fileType === FileType.PDF)
                  fileInfo.isMedia = true;

                this.uploadStateService.setFileInfo(fileInfo);
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
