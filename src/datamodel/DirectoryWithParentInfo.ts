import {DirectoryInfo} from "./DirectoryInfo";

export interface DirectoryWithParentInfo {
  parent:DirectoryInfo,
  directories:DirectoryInfo[]
}
