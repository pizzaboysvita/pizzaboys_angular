import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard  {
  
  public url : any;

  constructor(public router: Router) { }
  
  ngOnInit(){
    this.url = this.router.url;
  } 

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || user === null) {
      this.router.navigate(['/auth/login']);
      return true;
    }
    else if (user) {
      if (!Object.keys(user).length) {
        this.router.navigate(['/auth/login']);
        return true;
      }
    }
    return true;
  }

  
}
