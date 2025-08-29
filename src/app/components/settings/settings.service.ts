import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private apiUrl = "http://localhost:3003/api/promocode";

  constructor(private http: HttpClient) {}

  createPromoCode(promoCodeData: any): Observable<any> {
    return this.http.post(this.apiUrl, promoCodeData);
  }
}
