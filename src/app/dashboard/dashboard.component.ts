import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {SidenavService} from "../../service/sidenav.service";
import {MatSidenav} from "@angular/material/sidenav";
import {ViewportRuler} from "@angular/cdk/overlay";
import {IInfiniteScrollEvent} from "ngx-infinite-scroll";
import {MediaMatcher} from "@angular/cdk/layout";
import {NgxFileDropEntry} from "ngx-file-drop";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  wasTriggered: boolean = false;
  mobileQuery!: MediaQueryList;

  @ViewChild('snav') snav!: MatSidenav;

  private mobileQueryListener!: () => void;

  constructor(private sidenavService: SidenavService,
              private ruler: ViewportRuler,
              private changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher) {
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

  droppedFile($event: NgxFileDropEntry[]) {
    console.log($event)
  }
}
