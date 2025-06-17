import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { SessionStorageService } from '../services/session-storage.service';
import { inject } from '@angular/core';
import { ApisService } from '../services/apis.service';
import { catchError, finalize, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const session=inject(SessionStorageService)
  const apis=inject(ApisService)
  const router=inject(Router)
  apis.show()
    const token = JSON.parse(session.getsessionStorage('loginDetails') as any) ;
console.log(token)
if(token){
   const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.token}`,
      },
    });

      return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('401 Unauthorized error detected, logging out the user...');
          
          // Perform logout or redirect to login page
          apis.hide(); // Hide loader
        router.navigate(['/login']); // Redirect to the login page
          sessionStorage.clear()
        }
        return throwError(() => error); // Pass error to the subscriber
      }),
      
      finalize(()=>{
      console.log("Finalizing the request");
    apis.hide();
    })

  
  )
}else{
   apis.hide();
  return next(req)
}
};
