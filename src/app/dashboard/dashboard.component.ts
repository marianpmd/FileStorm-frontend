import {ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
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
import {FileInfo} from "../../datamodel/FileInfo";
import {ActivatedRoute, Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import {FileType} from "../../utils/FileType";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UploadStateService} from "../../service/upload-state.service";
import {FileItemDialogComponent} from "../file-item-dialog/file-item-dialog.component";
import {HttpStatusCode} from "@angular/common/http";
import {debounceTime, finalize, Subscription, switchMap, tap} from "rxjs";
import {FileUpdateDialogComponent} from "../file-update-dialog/file-update-dialog.component";
import {FiltersDialogComponent} from "../filters-dialog/filters-dialog.component";
import {FormControl} from "@angular/forms";
import {DirectoryCreateDialogComponent} from "../directory-create-dialog/directory-create-dialog.component";
import {DirectoryService} from "../../service/directory.service";
import {DirectoryInfo} from "../../datamodel/DirectoryInfo";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('snav') snav!: MatSidenav;
  @ViewChild('auto', {static: true}) auto!: ElementRef;

  wasTriggered: boolean = false;
  mobileQuery!: MediaQueryList;
  loadingDialogRef!: MatDialogRef<UploadLoadingDialogComponent>;

  files: FileInfo[] = [];
  directories:DirectoryInfo[] = [];

  userEmail!: string;
  fileUploadSubscription!: Subscription;

  lastAdded!: FileInfo;
  sortBy: string = 'lastModified';
  asc: boolean = false;

  currentPaths: string[] = []; //root

  currentPage: number = 0;

  value: any;
  isLoading: boolean;
  isRequestMade: boolean = false;
  searchFileControl: FormControl = new FormControl('');
  isLoadingAutocomplete: boolean = false;
  filteredFiles: FileInfo[] = [];
  windowScrolled: boolean = false;


  constructor(private sidenavService: SidenavService,
              private ruler: ViewportRuler,
              private changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private fileService: FileService,
              private dialog: MatDialog,
              private router: Router,
              private jwtService: JwtHelperService,
              private snackBar: MatSnackBar,
              private uploadStateService: UploadStateService,
              private renderer: Renderer2,
              private activeRoute: ActivatedRoute,
              private directoryService: DirectoryService
  ) {
    this.isLoading = true;
    this.mobileQuery = media.matchMedia('(max-width : 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('', this.mobileQueryListener);
  }

  private mobileQueryListener!: () => void;

  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.snav);
    this.snav.autoFocus = false;
    if (!this.mobileQuery.matches) {
      this.snav.open();
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnInit(): void {
    this.loadAllInitialFilesPaginated(this.sortBy, 0, 100, this.asc);

    this.loadDirectoriesByPath();

    let jwt = localStorage.getItem("ocl-jwt");
    let decodedToken = this.jwtService.decodeToken(jwt as string);
    this.userEmail = decodedToken.sub;



    let div = document.getElementsByClassName("infinite-container")[0];
    div.addEventListener('scroll', () => {
      this.windowScrolled = div.scrollTop >= 100;
    })


    this.searchFileControl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.isLoading = true;
        }),
        switchMap(value => this.findByKeyword(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(data => {
        if (data.length == 0) {
          this.files = [];
        } else {
          data.forEach(fdata => {
            if (fdata.fileType === FileType.IMAGE ||
              fdata.fileType === FileType.VIDEO ||
              fdata.fileType === FileType.PDF)
              fdata.isMedia = true;
          })
          this.files = data;
        }

      });

  }

  private findByKeyword(value: string) {
    return this.fileService.findAllByKeyword(value);
  }

  onWindowScroll($event: IInfiniteScrollEvent) {
    console.log("TRIGGER LOAD")
    console.log($event.currentScrollPosition)

    this.loadFilesAndAppend(this.sortBy, this.currentPage, 100, this.asc);
  }

  async onFileDrop(files: NgxFileDropEntry[]) {
    let fileArr: File[] = [];
    for (let ngxFile of files) {
      let fileEntry = ngxFile.fileEntry as FileSystemFileEntry;
      let actualFile = await this.getFiles(fileEntry);
      fileArr.push(<File>actualFile);
    }

    this.handleFileUpload(fileArr);
  }


  private getFiles(fileEntry: FileSystemFileEntry) {
    return new Promise(resolve => {
      fileEntry.file(actualFile => {
        resolve(actualFile);
      })
    })
  }

  onUploadClick($event: any) {
    console.log("on click")
    let fileList: FileList = $event.target.files;
    this.handleFileUpload(Array.from(fileList));
  }

  handleFileUpload(files: File[]) {
    if (files.length > 6) {
      this.snackBar.open("Only up to 6 files are allowed at once!", "Close", {
        duration: 2000,
        panelClass: ['mat-toolbar', 'mat-warn']
      });
      return;
    }
    if (this.fileUploadSubscription) {
      this.fileUploadSubscription.unsubscribe();
    }
    if (this.loadingDialogRef) {
      this.loadingDialogRef.close();
    }
    console.log("uplading fil")
    let matDialogRef = this.dialog.open(FileUploadDialogComponent, {
      data: files
    });

    matDialogRef.afterClosed()
      .subscribe(async result => {
        if (!result) return;

        let anyFileExists = await this.checkIfAnyFileExists(files);
        if (anyFileExists) {
          console.log("Found a file that exists")
          let fileAlreadyExistsDialogRef = this.dialog.open(FileUpdateDialogComponent);
          fileAlreadyExistsDialogRef.afterClosed()
            .subscribe(result => {
              if (result == undefined) return;
              this.startActualUpload(files, true);
            })
        } else {
          this.startActualUpload(files, false);
        }
      });
  }

  private startActualUpload(files: File[], shouldUpload: boolean) {
    this.loadingDialogRef = this.dialog.open(UploadLoadingDialogComponent, {
      data: {files: files, shouldUpdate: shouldUpload, pathFromRoot: this.currentPaths},
      hasBackdrop: false,
      position: {
        right: "true",
        bottom: "true"
      }
    });

    if (shouldUpload === false) {
      this.fileUploadSubscription = this.uploadStateService.getFileInfo().subscribe(
        result => {
          if (result) {
            if (this.lastAdded !== result) {
              this.files.push(result);
              this.lastAdded = result;
            }
          }
        }
      );
    }
  }

  private async checkIfAnyFileExists(files: File[]) {
    for (const file of files) {
      console.log("Checking file : ", file)
      let res = await this.checkOneFile(file);
      if (res === true) {
        return true;
      }
    }
    return false;
  }


  private async checkOneFile(file: File) {
    return new Promise((resolve => {
      this.fileService.checkFileByName(file.name)
        .subscribe(exists => {
          resolve(exists);
        })
    }))
  }

  onLogoutClick() {
    let jwt = localStorage.getItem("ocl-jwt");
    if (jwt) {
      localStorage.removeItem("ocl-jwt");
      this.router.navigateByUrl("/login");
    }
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
            this.downloadFileById(file.id);
            break;
          case 'delete' :
            this.deleteFileById(file.id);
            break;
        }
      });
  }

  private downloadFileById(id: number) {
    this.fileService.downloadFileById(id)
      .subscribe(response => {

      });
  }

  private deleteFileById(id: number) {
    this.fileService.deleteFileById(id)
      .subscribe(response => {
        if (response.status === HttpStatusCode.Ok) {
          this.files = this.files.filter(fileInfo => fileInfo.id !== id)
        }
      });
  }

  uploaderAction(uploader: HTMLInputElement) {
    if (this.loadingDialogRef) {
      this.loadingDialogRef.close();
      uploader.value = '';
    }
    console.log("clicked test")
    uploader.click();
  }

  openFilters() {
    let matDialogRef = this.dialog.open(FiltersDialogComponent, {
      data: {
        sortBy: this.sortBy,
        asc: this.asc
      },
      autoFocus: false
    });

    matDialogRef.afterClosed()
      .subscribe(result => {
        console.log("Chosen result : ", result);
        if (!result) return;
        this.sortBy = result.sortBy;
        this.asc = result.asc;

        this.currentPage = 0; //reset
        this.files = [];

        this.loadAllInitialFilesPaginated(this.sortBy, this.currentPage, 100, this.asc)
      })
  }


  private loadAllInitialFilesPaginated(sortBy: string, page: number, size: number, asc: boolean) {
    this.fileService.loadAllFiles(sortBy, page, size, asc)
      .subscribe(fileData => {
        fileData.content.forEach(fdata => {
          if (fdata.fileType === FileType.IMAGE ||
            fdata.fileType === FileType.VIDEO ||
            fdata.fileType === FileType.PDF)
            fdata.isMedia = true;

          this.files.push(fdata);
        })

        if (!fileData.last)
          this.currentPage = fileData.pageable.pageNumber + 1;
        this.isRequestMade = true;
        this.isLoading = false;
      })
  }

  private loadFilesAndAppend(sortBy: string, currentPage: number, size: number, asc: boolean) {
    this.fileService.loadAllFiles(sortBy, currentPage, size, asc)
      .subscribe(fileData => {
        console.log("calling append")
        if (fileData.content.length !== 0) {
          console.log("is not last")

          fileData.content.forEach(fdata => {
            if (fdata.fileType === FileType.IMAGE ||
              fdata.fileType === FileType.VIDEO ||
              fdata.fileType === FileType.PDF)
              fdata.isMedia = true;

            this.files.push(fdata);
          })

          this.currentPage = fileData.pageable.pageNumber + 1;
          console.log("pushed files : ", this.files)
        }
      })
  }

  scrollToTop() {
    // @ts-ignore
    return document.getElementsByClassName('infinite-container')[0].scroll({
      behavior: 'smooth',
      top: 0,
      left: 0
    });
  }

  shouldNotShow() {
    console.log("Is loading ? ", this.isLoading);
    return this.isLoading;
  }

  addDirectory() {
    this.dialog.open(DirectoryCreateDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (!result) {
          this.snackBar.open("Directory must have a name", 'Close', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-warn']
          })
        }

        this.directoryService.createDirectory(result, this.currentPaths)
          .subscribe(response => {
            console.log("THE RESPONSE OF CR DIR : ", response)
          })

      });
  }

  private loadDirectoriesByPath() {
    this.directoryService.getAllDirectories(this.currentPaths)
      .subscribe(response=>{
        console.log("LOCAL PATH : ");
        console.log(this.currentPaths)
        console.log(response)
        this.directories = response;
      })
  }

  onDirClick(dir: DirectoryInfo) {
    console.log("DIR CLICKED")
  }
}
