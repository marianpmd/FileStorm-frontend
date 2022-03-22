import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {SidenavService} from "../../service/sidenav.service";
import {MatSidenav} from "@angular/material/sidenav";
import {ViewportRuler} from "@angular/cdk/overlay";
import {IInfiniteScrollEvent} from "ngx-infinite-scroll";
import {MediaMatcher} from "@angular/cdk/layout";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {FileService} from "../../service/file.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FileUploadDialogComponent} from "../file-upload-dialog/file-upload-dialog.component";
import {UploadLoadingDialogComponent} from "../upload-loading-dialog/upload-loading-dialog.component";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  wasTriggered: boolean = false;
  mobileQuery!: MediaQueryList;

  loadingDialogRef!:MatDialogRef<UploadLoadingDialogComponent>;

  @ViewChild('snav') snav!: MatSidenav;

  private mobileQueryListener!: () => void;
  private files: NgxFileDropEntry[] = [];

  constructor(private sidenavService: SidenavService,
              private ruler: ViewportRuler,
              private changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private fileService: FileService,
              private dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width : 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('', this.mobileQueryListener);
  }

  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.snav);
    if (!this.mobileQuery.matches) {
      this.snav.open();
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnInit(): void {
  }

  onWindowScroll($event: IInfiniteScrollEvent) {
    console.log("TRIGGER LOAD")
    console.log($event.currentScrollPosition)
  }

  fileOver($event: any) {

  }

  droppedFile(files: NgxFileDropEntry[]) {

    if (this.loadingDialogRef){
      this.loadingDialogRef.close();
    }

    let matDialogRef = this.dialog.open(FileUploadDialogComponent, {
      data: files
    });

    matDialogRef.afterClosed()
      .subscribe(result => {
        console.log(result)
        if (!result) return;
        this.files = files;

        let loadingDialogRef = this.dialog.open(UploadLoadingDialogComponent, {
          data: files,
          hasBackdrop: false,
          position: {
            right: "true",
            bottom: "true"
          }
        });
        this.loadingDialogRef = loadingDialogRef;

      });
  }
}
