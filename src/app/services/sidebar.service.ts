import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  constructor() { }
  private sidebarVisible = new BehaviorSubject<boolean>(false);
  sidebarVisible$ = this.sidebarVisible.asObservable();

  toggleSidebar() {
    this.sidebarVisible.next(!this.sidebarVisible.value);
  }
}
