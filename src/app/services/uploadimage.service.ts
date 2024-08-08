import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadimageService {

  private environment = environment.aguapenApi;

  // Inject HttpClient
  private http = inject(HttpClient);

  constructor() {}

  uploadImage(id: string, imageFile: File): Observable<any> {
    const url = `${this.environment}registros/${id}/imagen`;
    const formData: FormData = new FormData();
    formData.append('imagen', imageFile, imageFile.name);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(url, formData, { headers });
  }
}
