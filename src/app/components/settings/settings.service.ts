import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  private baseUrl = "http://78.142.47.247:3003/api";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const authToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOjF9LCJpYXQiOjE3NTc0OTQ3ODQsImV4cCI6MTc1NzQ5ODM4NH0.8B7XdjQyZccFhJFS8CA1kzGVbzCQs_y8cyOwUW1oV2k";

    if (!authToken) {
      throw new Error("Authentication token not found.");
    }

    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    });
  }

  createPromoCode(promoCodeData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/promocode`, promoCodeData, {
      headers,
    });
  }

  createFee(feeData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/settings/conditionalfee`, feeData, {
      headers,
    });
  }

  savePickupService(pickupData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.baseUrl}/settings/pickupservice`,
      pickupData,
      { headers }
    );
  }

  saveDeliveryService(deliveryData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.baseUrl}/settings/deliveryservice`,
      deliveryData,
      { headers }
    );
  }
}
