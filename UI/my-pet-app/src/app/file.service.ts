import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // define function to upload file
  public upload(formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.baseUrl}/file/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // define function to download file
  public download(filename: string): Observable<HttpEvent<Blob>>{
    return this.http.get(`${this.baseUrl}/file/download/${filename}`,{
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }
}
