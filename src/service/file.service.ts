import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {FileInfo} from "../datamodel/FileInfo";

const UPLOAD_URL = environment.baseUrl + '/file/upload';
const LOAD_ALL_URL = environment.baseUrl + '/file/all';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http:HttpClient) { }

  uploadFiles(file: File){
    const formData = new FormData()
    formData.append('file', file);

    return this.http.post(UPLOAD_URL, formData,{
      reportProgress : true,
      responseType : 'json',
      observe : 'events'
    });
  }

  loadAllFiles():Observable<FileInfo[]>{
     return this.http.get<FileInfo[]>(LOAD_ALL_URL);
  }

}
