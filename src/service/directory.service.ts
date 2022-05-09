import { Injectable } from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DirectoryInfo} from "../datamodel/DirectoryInfo";
import {DirectoryWithParentInfo} from "../datamodel/DirectoryWithParentInfo";

const CREATE_DIRECTORY = environment.baseUrl + '/dir/create';
const ALL_DIRECTORIES = environment.baseUrl + '/dir/getAll';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  constructor(private http: HttpClient) { }

  createDirectory(dirName:string,pathsFromRoot:string[]){
    let fullPath = [...pathsFromRoot , dirName];
    return this.http.post<DirectoryInfo>(CREATE_DIRECTORY, fullPath);
  }

  getAllDirectories(pathsFromRoot:string[]){
    return this.http.post<DirectoryWithParentInfo>(ALL_DIRECTORIES,pathsFromRoot);
  }

}
