import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FileInfo} from "../../../datamodel/FileInfo";
import {computeFileSize} from "../../../utils/Common";
import {ProgressSpinnerMode} from "@angular/material/progress-spinner";
import {FileService} from "../../../service/file.service";
import {FileType} from "../../../utils/FileType";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";


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
  sourceUrl!: SafeUrl
  generatedLink!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FileInfo,
    private fileService: FileService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    console.log("IS MEDIA >? ")
    console.log(this.data.isMedia)
    this.isMedia = this.data.isMedia;
    this.generatedLink = `${environment.linkGenURL}${this.data.id}`;

    if (this.isMedia) {
      this.fileService.getByFileId(this.data.id)
        .subscribe({
          next: (response) => {
            this.source = response;
            if (this.source) this.sourceUrl = this.sourceAsBlob(this.source);
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

  isVideo(fileType: string) {
    return fileType === FileType.VIDEO
  }

  sourceAsBlob(source: any) {
    let blob = new Blob([source]);
    const unsafeURL = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustUrl(unsafeURL);
  }

  makePublic(data: FileInfo) {
    this.fileService.makeFilePublic(data.id)
      .subscribe(response=>{
        this.data.isPublic = response.isPublic;
        this.generatedLink = `${environment.linkGenURL}${response.id}`;
      });
  }

  makePrivate(data: FileInfo) {
    this.fileService.makeFilePrivate(data.id)
      .subscribe(response=>{
        this.data.isPublic = response.isPublic;
      });
  }
}
