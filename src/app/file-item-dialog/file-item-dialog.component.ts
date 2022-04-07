import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {FileInfo} from "../../datamodel/FileInfo";
import {computeFileSize} from "../../utils/Common";

@Component({
  selector: 'app-file-item-dialog',
  templateUrl: './file-item-dialog.component.html',
  styleUrls: ['./file-item-dialog.component.scss']
})
export class FileItemDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : FileInfo
  ) { }

  ngOnInit(): void {
  }

  computeFileSize(size: number) {
    return computeFileSize(size);
  }
}
