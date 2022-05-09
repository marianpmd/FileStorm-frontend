import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable, tap} from "rxjs";
import {FileInfo, FileInfoPaged} from "../datamodel/FileInfo";

const UPLOAD_URL = environment.baseUrl + '/file/upload';
const LOAD_ALL_URL = environment.baseUrl + '/file/all';
const DOWNLOAD_ONE_URL = environment.baseUrl + '/file/one';
const DELETE_ONE_URL = environment.baseUrl + '/file/delete/one';
const CHECK_FILE_URL = environment.baseUrl + '/file/check';
const LOAD_BY_KEYWORD = environment.baseUrl + '/file/byKeyword';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  uploadFile(file: File, pathFromRoot: string[], shouldUpdate?: boolean) {
    const formData = new FormData()
    let httpParams = new HttpParams();
    if (pathFromRoot.length === 0)
    httpParams = httpParams.set('pathFromRoot','');

    for (let path of pathFromRoot) {
      httpParams = httpParams.append('pathFromRoot',path);
    }
    const headers = new HttpHeaders({'ngsw-bypass': ''});

    formData.append('file', file);

    if (shouldUpdate) {
      formData.append("shouldUpdate", shouldUpdate as unknown as string);
    }

    return this.http.post(UPLOAD_URL, formData, {
      reportProgress: true,
      responseType: 'json',
      observe: 'events',
      headers: headers,
      params : httpParams
    });
  }

  loadAllFiles(sortBy: string, page: number, size: number, asc: boolean, currentPaths: string[]): Observable<FileInfoPaged> {
    let params = new HttpParams();
    params = params.set("sortBy", sortBy);
    params = params.set("page", page);
    params = params.set("size", size);
    params = params.set("asc", asc);
    if (currentPaths.length === 0) params = params.set("pathFromRoot",'');

    for (let currentPath of currentPaths) {
      params = params.append("pathFromRoot",currentPath);
    }

    return this.http.get<FileInfoPaged>(LOAD_ALL_URL, {params});
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
      reportProgress : true,
      observe: "events",
      withCredentials: true
    })
    //
    //
    //   .pipe(
    //   tap((response: any) => {
    //     const dataType = response.type;
    //     const fileName = FileService.getFileNameFromContentDisposition(response.headers.get('Content-Disposition'));
    //
    //     const binaryData: any = [];
    //     const downloadLink: HTMLAnchorElement = document.createElement('a');
    //
    //     binaryData.push(response.body);
    //
    //     downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
    //     console.log("THE DOWNLOAD LINK");
    //     console.log(downloadLink);
    //     downloadLink.download = fileName;
    //
    //     document.body.appendChild(downloadLink);
    //     downloadLink.click();
    //
    //     window.URL.revokeObjectURL(downloadLink.href);
    //     downloadLink.remove();
    //   })
    // )


  }

  static getFileNameFromContentDisposition(contentDispositionVal: string | null): string {
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

  checkFileByName(filename: string, currentPaths: string[]) {

    let httpParams = new HttpParams();
    httpParams = httpParams.append('filename',filename);

    if (currentPaths.length === 0) httpParams = httpParams.set("pathFromRoot",'');

    for (let path of currentPaths) {
      httpParams = httpParams.append('pathFromRoot',path);
    }

    return this.http.get<boolean>(CHECK_FILE_URL, {
      params: httpParams
    });
  }

  getByFileId(id: number) {
    return this.http.get(DOWNLOAD_ONE_URL, {
      responseType: 'arraybuffer' as 'json',
      params: {
        id: id
      }
    })
  }

  findAllByKeyword(value: string) {
    return this.http.get<FileInfo[]>(LOAD_BY_KEYWORD, {
      params: {
        keyword: value
      }
    })
  }
}
