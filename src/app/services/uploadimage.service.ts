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



  compressImage(imageFile: File, maxWidth: number, maxHeight: number, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate the new dimensions based on max width/height while maintaining the aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Convert canvas back to Blob
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Image compression failed.'));
            }
          }, 'image/jpeg', quality);
        };

        img.onerror = (error) => {
          reject(error);
        };
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(imageFile);
    });
  }

  async uploadImage(id: string, imageFile: File): Promise<Observable<any>> {
    const compressedImage = await this.compressImage(imageFile, 1024, 1024, 0.7);
    const url = `${this.environment}registros/${id}/imagen`;

    const formData: FormData = new FormData();
    formData.append('imagen', compressedImage, imageFile.name);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(url, formData, { headers });
  }

  /*   uploadImage(id: string, imageFile: File): Observable<any> {
    const url = `${this.environment}registros/${id}/imagen`;
    const formData: FormData = new FormData();
    formData.append('imagen', imageFile, imageFile.name);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(url, formData, { headers });
  }

 */

}