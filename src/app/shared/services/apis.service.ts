import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApisService {
basesurl='http://localhost:3002'
  constructor() { }
 private http = inject(HttpClient);
 isLoading = new BehaviorSubject<boolean>(false);
   getApi(endpoint: string) {
    console.log('GET request URL -->', 'http://78.142.47.247:3001'+endpoint);
 return this.http.get(this.basesurl+endpoint);
  }
 postApi(endpoint:any,req_body:any){
   return this.http.post(this.basesurl+endpoint,req_body);
 }
  putApi(endpoint:any,req_body:any){
   return this.http.put(this.basesurl+endpoint,req_body);
 }

  deleteApi(endpoint:any,req_body:any){
   return this.http.delete(this.basesurl+endpoint,{ body: req_body });
 }
   show(): void {
    this.isLoading.next(true);

  }
    hide(): void {
 
    this.isLoading.next(false);
  }
}
