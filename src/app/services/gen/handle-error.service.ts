import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HandleErrorService {
  private error: any;

  storeError(error: any): void {
    this.error = error;
  }

  getError(): any {
    return this.error;
  }

  clearError(): void {
    this.error = null;
  }
}
