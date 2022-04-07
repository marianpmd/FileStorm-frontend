import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable, tap} from "rxjs";
import {FileInfo} from "../datamodel/FileInfo";

const UPLOAD_URL = environment.baseUrl + '/file/upload';
const LOAD_ALL_URL = environment.baseUrl + '/file/all';
const DOWNLOAD_ONE_URL = environment.baseUrl + '/file/one';
const DELETE_ONE_URL = environment.baseUrl + '/file/delete/one';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  uploadFiles(file: File) {
    const formData = new FormData()
    formData.append('file', file);

    return this.http.post(UPLOAD_URL, formData, {
      reportProgress: true,
      responseType: 'json',
      observe: 'events'
    });
  }

  loadAllFiles(): Observable<FileInfo[]> {
    return this.http.get<FileInfo[]>(LOAD_ALL_URL);
  }

  downloadFileById(fileId: number) {
    let headers = new HttpHeaders();
    headers.append("Accept", "*/*");
    return this.http.get(DOWNLOAD_ONE_URL, {
      params: {
        id: fileId
      },
      headers: headers,
      responseType: "blob" as "json",
      observe: "response",
      withCredentials: true
    }).pipe(
      tap((response: any) => {
        const dataType = response.type;
        const fileName = FileService.getFileNameFromContentDisposition(response.headers.get('Content-Disposition'));

        const binaryData: any = [];
        const downloadLink: HTMLAnchorElement = document.createElement('a');

        binaryData.push(response.body);

        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        downloadLink.download = fileName;

        document.body.appendChild(downloadLink);
        downloadLink.click();

        window.URL.revokeObjectURL(downloadLink.href);
        downloadLink.remove();
      })
    )
  }

  private static getFileNameFromContentDisposition(contentDispositionVal: string): string {
    // @ts-ignore
    let fileNameFull = contentDispositionVal.match(/filename=((["]).*?\2|[^;\n]*)/g)[0];

    fileNameFull = fileNameFull.replace(/"/g, '');

    return fileNameFull.substring(9, fileNameFull.length);
  }

  deleteFileById(fileId: number) {
    return this.http.delete<string>(DELETE_ONE_URL, {
      params: {
        id: fileId
      },
      observe: "response"
    });
  }
}
