import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DirectoryInfo} from "../../../datamodel/DirectoryInfo";

@Component({
  selector: 'app-directory-delete-dialog',
  templateUrl: './directory-delete-dialog.component.html',
  styleUrls: ['./directory-delete-dialog.component.scss']
})
export class DirectoryDeleteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)public data:DirectoryInfo) { }

  ngOnInit(): void {
  }

}
