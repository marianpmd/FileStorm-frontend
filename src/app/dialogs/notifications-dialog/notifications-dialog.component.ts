import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {NotificationInfo} from "../../../datamodel/NotificationInfo";
import {NotificationState} from "../../../utils/NotificationState";

interface ParsedNotification {
  sender:string;
  message:string;
  action:string;
}

@Component({
  selector: 'app-notifications-dialog',
  templateUrl: './notifications-dialog.component.html',
  styleUrls: ['./notifications-dialog.component.scss']
})
export class NotificationsDialogComponent implements OnInit {

  parsedNotifications:ParsedNotification[] = [];

  constructor(@Inject(MAT_DIALOG_DATA)public data : NotificationInfo[]) {
    if (data)
    for (let notificationInfo of this.data) {
      let [notificationSender,notificationMessage,notificationAction] = notificationInfo.description.split(":");
      this.parsedNotifications.push({
        sender: notificationSender,
        message: notificationMessage,
        action : notificationAction
      })
    }
  }

  ngOnInit(): void {

  }

  isUnread(notification: NotificationInfo) {
    return notification.notificationState === NotificationState.UNREAD;
  }

}
