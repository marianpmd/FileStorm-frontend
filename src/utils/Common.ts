import {UserInfo} from "../datamodel/UserInfo";

export function computeFileSize(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
export function computeUsagePercentage(userInfo: UserInfo) {
  let total = userInfo.assignedSpace;
  let used = userInfo.occupiedSpace;

  return Math.round(100 * used / total);
}
