import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarVisibility = new BehaviorSubject<boolean>(false);
  sidebarVisibility$ = this.sidebarVisibility.asObservable();

  toggleSidebar() {
    const newValue = !this.sidebarVisibility.value;
    console.log('Toggling sidebar visibility to', newValue);
    this.sidebarVisibility.next(newValue);
  }
}
