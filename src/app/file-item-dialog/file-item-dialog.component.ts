import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FileInfo} from "../../datamodel/FileInfo";
import {computeFileSize} from "../../utils/Common";
import {ProgressSpinnerMode} from "@angular/material/progress-spinner";
import {FileService} from "../../service/file.service";
import {FileType} from "../../utils/FileType";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-file-item-dialog',
  templateUrl: './file-item-dialog.component.html',
  styleUrls: ['./file-item-dialog.component.scss']
})
export class FileItemDialogComponent implements OnInit {
  isMedia!: boolean;
  progressMode: ProgressSpinnerMode = 'indeterminate';
  isLoaded: boolean = false;
  source!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FileInfo,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<FileItemDialogComponent>
  ) {
  }

  ngOnInit(): void {
    console.log("IS MEDIA >? ")
    console.log(this.data.isMedia)
    this.isMedia = this.data.isMedia;
    if (this.isMedia) {
      this.fileService.getByFileId(this.data.id)
        .subscribe({
          next: (response) => {
            this.source = response;
            this.isLoaded = true;
          }
        });
    }
  }

  computeFileSize(size: number) {
    return computeFileSize(size);
  }

  isPdf(fileType: string) {
    return fileType === FileType.PDF;
  }

  isImage(fileType: string) {
    return fileType === FileType.IMAGE
  }

  sourceAsBlob(source: any) {
    console.log("IS IMAGE")
    let blob = new Blob([source]);
    const unsafeURL = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustUrl(unsafeURL);
  }

  stopPropagation($event: MouseEvent) {
    $event.stopPropagation();
  }

  onBackgroundClick($event: MouseEvent) {
    this.dialogRef.close();
  }
}
