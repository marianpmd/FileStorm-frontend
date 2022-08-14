export interface FileInfo {
  id: number;
  name: string;
  path: string;
  size: number;
  fileType: string;
  isMedia: boolean;
  isLoaded: boolean;
  isDownloading : boolean;
  downloadedAmount:number;
  isPublic:boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}


export interface FileInfoPaged {
  content: FileInfo[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}



