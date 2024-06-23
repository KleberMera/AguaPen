import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private srvG: GeneralService,
    private httpClient: HttpClient
    
  ) { }


  
}
