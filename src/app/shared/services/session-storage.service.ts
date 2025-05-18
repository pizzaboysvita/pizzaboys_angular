import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() {}

  private selectedMenuTitleSource = new BehaviorSubject<string>('');
  selectedMenuTitle$ = this.selectedMenuTitleSource.asObservable();

  setSelectedMenuTitle(title: string) {
    sessionStorage.setItem('selectedMenuTitle', title);
    this.selectedMenuTitleSource.next(title);
  }

  getSelectedMenuTitle() {
    return sessionStorage.getItem('selectedMenuTitle') || '';
  }


  // Remove item
  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  // Clear all session storage
  clear(): void {
    sessionStorage.clear();
  }
  setsessionStorage(key:any,value:any){
        sessionStorage.setItem(key, value);
  }
  getsessionStorage(key:any) {
    return sessionStorage.getItem(key)
  }
}
