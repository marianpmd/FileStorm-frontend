import { Component, OnInit } from '@angular/core';
import {FileInfo} from "../../datamodel/FileInfo";
import {FileType} from "../../utils/FileType";

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent implements OnInit {
  file!: FileInfo;

  constructor() { }

  ngOnInit(): void {
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
      default:
        return 'insert_drive_file'
    }
  }
}
