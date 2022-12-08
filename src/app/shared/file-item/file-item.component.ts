import {Component, Input, OnInit} from '@angular/core';
import {FileInfo} from "../../../datamodel/FileInfo";
import {FileItemDialogComponent} from "../../dialogs/file-item-dialog/file-item-dialog.component";
import {FileType} from "../../../utils/FileType";
import {MatDialog} from "@angular/material/dialog";
import {FileService} from "../../../service/file.service";

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent implements OnInit {

  @Input() file?: FileInfo;
  thumbnail: any;
  isThumbnailLoaded: boolean = false;


  constructor(private dialog: MatDialog,
              private fileService: FileService) {
  }

  ngOnInit(): void {
    this.fileService.getThumbnail(this.file)
      .subscribe({
        next: data => {
          if (data.size) {
            console.log("NOT NULL FOR ", this.file?.id)
            this.createImageFromBlob(data);
            this.isThumbnailLoaded = true;
          }
        },
        error: err => {
          this.isThumbnailLoaded = false;
          console.log(err);
        }
      })
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.thumbnail = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  onFileItemClick(file: FileInfo) {
    let matDialogRef = this.dialog.open(FileItemDialogComponent, {
      data: file,
      width: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      hasBackdrop: false,
      panelClass: 'file-item-dialog'
    });

    // matDialogRef.afterClosed()
    //   .subscribe(result => {
    //     switch (result) {
    //       case 'download' :
    //         // this.downloadFileById(file.id);
    //         console.log("DOWNLOADING");
    //         break;
    //       case 'delete' :
    //         // this.deleteFileById(file.id);
    //         console.log("DELETING");
    //         break;
    //     }
    //   });
  }


  getIconBySuffix(fileType: string) {
    switch (fileType) {
      case FileType.FILE :
        return 'insert_drive_file'
      case FileType.IMAGE :
        return 'image'
      case FileType.VIDEO :
        return 'play_circle'
      case FileType.ARCHIVE :
        return 'archive'
      case FileType.PDF :
        return 'picture_as_pdf'
      default:
        return 'insert_drive_file'
    }
  }

  isIcon() {
    return false;
  }

  hasThumbnail() {
    switch (this.file?.fileType){
      case FileType.PDF :
      case FileType.FILE :
      case FileType.ARCHIVE :
      case FileType.VIDEO :
        return false;
    }
    return true;
  }
}
