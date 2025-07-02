import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionStorageService } from '../services/session-storage.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard  {
  
  public url : any;

  constructor(public router: Router,private sessionStorage:SessionStorageService) { }
  
  ngOnInit(){
    this.url = this.router.url;
  } 

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
  
    let user =this.sessionStorage.getsessionStorage('islogin') ;
    if (!user) {
      this.router.navigate(['/login']);
      return true;
    }
    else if (user) {
      if (!Object.keys(user).length) {
        this.router.navigate(['/login']);
        return true;
      }
    }
    return true;
  }

  
}
