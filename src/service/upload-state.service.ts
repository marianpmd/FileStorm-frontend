import { Injectable } from '@angular/core';
import {FileInfo} from "../datamodel/FileInfo";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadStateService {

  fileInfo!:FileInfo;
  fileInfoSubject!:BehaviorSubject<FileInfo>;


  constructor() {
    this.fileInfoSubject = new BehaviorSubject<FileInfo>(this.fileInfo);
  }

  setFileInfo(fileInfo:FileInfo){
    console.log("Setting file info : " , fileInfo)
    this.fileInfoSubject.next({...fileInfo});
  }

  getFileInfo(){
    return this.fileInfoSubject.asObservable();
  }
}
