import {NotificationState} from "../utils/NotificationState";

export interface NotificationInfo {
  id: number,
  dateTime:Date,
  description:string,
  notificationState:NotificationState
}
