import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FileService } from './file.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public filenames: string[] = [];
  public fileStatus = { status: "", requestType: "", percent: 0};

  constructor(private fileService: FileService){}

  public test(event: any){
    console.log(event);
  }

  // Define a function to upload files
  public onUploadFiles(event: any): void {
    const formData = new FormData();
    let files = event?.target?.files;
    for(const file of files){
      formData.append('files', file, file.name);
    }
    this.fileService.upload(formData).subscribe(
      event => {
        console.log(event);
        this.reportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  // Define a function to download files
  public onDownloadFile(filename: string): void {
    this.fileService.download(filename).subscribe(
      event => {
        console.log(event);
        this.reportProgress(event);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  private reportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch(httpEvent.type){
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Uploading...');
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Downloading...');
        break;
      case HttpEventType.ResponseHeader:
        console.log("Header returned", httpEvent);
        break;
      case HttpEventType.Response:
        if(httpEvent.body instanceof Array){
          this.fileStatus.status = 'done';
          for(const filename of httpEvent.body){
            this.filenames.unshift(filename);
          }
        } else {
          // download logic
          saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
            {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}));
        }
        this.fileStatus.status = 'done';
        break;
        default:
          console.log(httpEvent);
          break;
    }
  }

  private updateStatus(loaded: number, total: number, requestType: string): void {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }
}
