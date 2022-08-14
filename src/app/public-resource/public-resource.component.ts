import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DOWNLOAD_ONE_PUBLIC, DOWNLOAD_ONE_URL, FileService} from "../../service/file.service";

@Component({
  selector: 'app-public-resource',
  templateUrl: './public-resource.component.html',
  styleUrls: ['./public-resource.component.scss']
})
export class PublicResourceComponent implements OnInit {

  private fileId!:number;

  constructor(private route:ActivatedRoute,
              private fileService:FileService) { }

  ngOnInit(): void {
    this.route.params.subscribe(param=>{
      console.log(param['id'])
      this.fileId = param['id'];

      window.open(`${DOWNLOAD_ONE_PUBLIC}?id=${this.fileId}`, '_self');
    })
  }

  downloadFile() {
    window.open(`${DOWNLOAD_ONE_PUBLIC}?id=${this.fileId}`, '_self');
  }
}
