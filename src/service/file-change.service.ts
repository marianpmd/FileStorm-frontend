import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileChangeService {

  subject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);

  constructor() { }

  setChangedFileId(id: number){
    this.subject.next(id);
  }

  getChangedFileId(){
    return this.subject.asObservable();
  }
}
