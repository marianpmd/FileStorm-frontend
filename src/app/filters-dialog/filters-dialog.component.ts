import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.scss']
})
export class FiltersDialogComponent implements OnInit {
  sortBy!:string;
  asc!:boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { sortBy: string, asc: boolean },
    private dialogRef :MatDialogRef<FiltersDialogComponent>
  ) {
  }

  ngOnInit(): void {
    this.sortBy = this.data.sortBy;
    this.asc = this.data.asc;
  }

  onFilterApply() {
    this.dialogRef.close({
      sortBy: this.sortBy,
      asc: this.asc
    })
  }
}
