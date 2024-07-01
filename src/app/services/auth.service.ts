import { environment } from './../../environments/environment.development';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private environment = environment.aguapenApi;

  constructor(private http: HttpClient, private srvG: GeneralService) {}

  login(objLogin: any) {
    let url = 'login';
    return this.http.post(
      this.environment + url,
      this.srvG.objectToFormData(objLogin)
    );
  }


}
