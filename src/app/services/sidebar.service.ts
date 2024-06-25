import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  private sidebarVisibility = signal<boolean>(false);

  get sidebarVisibility$() {
    return this.sidebarVisibility.asReadonly();
  }

  toggleSidebar() {
    this.sidebarVisibility.update(value => !value);
  }
}
