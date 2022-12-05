import {Component, Input, OnInit} from '@angular/core';
import {FileInfo} from "../../../datamodel/FileInfo";
import {FileItemDialogComponent} from "../../dialogs/file-item-dialog/file-item-dialog.component";
import {FileType} from "../../../utils/FileType";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent implements OnInit {

  // @Input() onFileItemClick?: (file: FileInfo) => void;

  @Input() file?: FileInfo;

  // @Input() getIconBySuffix?: (fileType: string) => (string);

  constructor(private dialog:MatDialog) {
  }

  ngOnInit(): void {
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

    matDialogRef.afterClosed()
      .subscribe(result => {
        switch (result) {
          case 'download' :
            // this.downloadFileById(file.id);
            console.log("DOWNLOADING");
            break;
          case 'delete' :
            // this.deleteFileById(file.id);
            console.log("DELETING");
            break;
        }
      });
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

}
