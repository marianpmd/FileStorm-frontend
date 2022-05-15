import {Component, HostBinding} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {OverlayContainer} from "@angular/cdk/overlay";
import {SidenavService} from "../service/sidenav.service";
import {NotificationService} from "../service/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {NotificationInfo} from "../datamodel/NotificationInfo";
import {NotificationsDialogComponent} from "./dialogs/notifications-dialog/notifications-dialog.component";
import {HttpStatusCode} from "@angular/common/http";
import {NotificationState} from "../utils/NotificationState";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') className = '';

  toggleControl = new FormControl(false);
  notificationsLength: number | undefined ;
  notifications!:NotificationInfo[];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private overlay: OverlayContainer,
              private sidenavService: SidenavService,
              private notificationService:NotificationService,
              private dialog:MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.triggerNotificationLoad();
    this.updateNotificationCount();
  }

  private updateNotificationCount() {
    this.notificationService.getNotifications()
      .subscribe(allNotifications => {
        if (allNotifications.length > 0) {
          let unreadNotifications = allNotifications.filter(notification => notification.notificationState === NotificationState.UNREAD);
          if (unreadNotifications.length != 0)
            this.notificationsLength = unreadNotifications.length;
          this.notifications = allNotifications;
        }
      })
  }

  private triggerNotificationLoad() {
    this.notificationService.getUserNotifications()
      .subscribe(response => {
        console.log(response);
        if (response.length > 0) {
          this.notificationService.setNotifications(response);
        }
      })
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  isLoginPath() : boolean {
    return this.router.url === "/login";
  }

  onNotificationClick() {
    let matDialogRef = this.dialog.open(NotificationsDialogComponent,{
      data  : this.notifications
    });

    matDialogRef.afterClosed()
      .subscribe(closedEvent=>{
        this.notificationService.updateNotificationsState()
          .subscribe(response=>{
            if (response.status === HttpStatusCode.Ok){
              this.notificationsLength = undefined;
            }
          });
      })
  }
}
