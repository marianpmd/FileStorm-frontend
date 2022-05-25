import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, OnInit} from '@angular/core';
import {UserInfo} from "../../datamodel/UserInfo";
import {AuthService} from "../../service/auth.service";
import {computeFileSize, computeUsagePercentage} from "../../utils/Common";
import {MatDialog} from "@angular/material/dialog";
import {
  StorageAssignmentDialogComponent
} from "../dialogs/storage-assignment-dialog/storage-assignment-dialog.component";
import {FileService} from "../../service/file.service";
import {AreYouSureDialogComponent} from "../dialogs/are-you-sure-dialog/are-you-sure-dialog.component";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminDashboardComponent implements OnInit {
  tableDataSource: UserInfo[] = [];
  displayedColumns: string[] = ['id', 'email', 'role', 'occupiedSpace', 'assignedSpace'];
  expandedElement: UserInfo | null | undefined = undefined;

  sysTotalSpace!: number;
  sysUsableSpace!: number;

  constructor(private userService: AuthService,
              private dialog: MatDialog,
              private fileService: FileService
  ) {
  }

  ngOnInit(): void {
    this.loadSysInfo();
    this.loadUserInfo();
  }

  private loadSysInfo() {
    this.fileService.getSystemInfo()
      .subscribe(response => {
        this.sysTotalSpace = response.totalSpace;
        this.sysUsableSpace = response.usableSpace;
      })
  }

  private loadUserInfo() {
    this.userService.getAllUsers()
      .subscribe(response => {
        this.tableDataSource = response;
      })
  }

  getHeaderTextFromColumnName(column: string) {
    switch (column) {
      case "id":
        return "Id";
      case "email":
        return "Email";
      case "role":
        return "Role";
      case "assignedSpace":
        return "Assigned Storage";
      case "occupiedSpace":
        return "Used Storage";
    }
    return "";
  }

  getElementValFromCol(element: any, column: string) {
    let parsedValue = element[column];
    if (column === 'occupiedSpace' || column === 'assignedSpace') {
      parsedValue = computeFileSize(element[column], 2);
    }

    return parsedValue;
  }

  computeUserPercentage(element: UserInfo) {
    if (element.assignedSpace === 0 && element.occupiedSpace === 0) {
      return 'Unassigned';
    }
    return computeUsagePercentage(element) + '% Used';
  }

  computeBarPercentage(element: UserInfo) {
    return computeUsagePercentage(element);
  }

  onStorageClick(element: UserInfo) {
    let matDialogRef = this.dialog.open(StorageAssignmentDialogComponent, {
      data: element
    });

    matDialogRef.afterClosed()
      .subscribe(response => {
        console.log("AFTER CLOSE ", response)
        this.loadUserInfo();
        this.loadSysInfo()
      })
  }

  computeSize(sysTotalSpace: number) {
    return computeFileSize(sysTotalSpace, 2);
  }

  computeSysPercentage(sysTotalSpace: number, sysUsableSpace: number) {
    let usedSpace = sysTotalSpace - sysUsableSpace;
    let remainingCoefficient = usedSpace/sysTotalSpace;
    return remainingCoefficient * 100;
  }

  onDeleteClick(element: UserInfo) {
    this.dialog.open(AreYouSureDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result)
          this.userService.deleteUser(element)
            .subscribe(response => {
              this.tableDataSource = this.tableDataSource.filter(user => user.id !== response.id);
            });
      })

  }
}
