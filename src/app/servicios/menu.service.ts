import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  

  private jsonURL = 'assets/menu.json';

  constructor(private http: HttpClient) {}

  getMenu(): Observable<any> {
    return this.http.get(this.jsonURL);
  }
}
