export enum UploadState {
  UPLOADING,DONE
}

export function snackErrorConfig() {
  return {
    duration: 2000,
    panelClass: ['mat-toolbar', 'mat-warn']
  };
}


export function snackSuccessConfig() {
  return {
    duration: 2000,
    panelClass: ['mat-toolbar', 'mat-snack-bar-success']
  };
}

