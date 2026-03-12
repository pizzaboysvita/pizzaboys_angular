import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  // private baseUrl = "http://78.142.47.247:3003/api";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const loginDetails = sessionStorage.getItem("loginDetails");

    if (!loginDetails) {
      throw new Error("Authentication token not found.");
    }

    const parsed = JSON.parse(loginDetails);
    const authToken = parsed.access_token;

    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
  }
  // ---------- Existing methods ----------
  createPromoCode(promoCodeData: any): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post(`${environment.apiUrl}/api/promocode`, promoCodeData, {
      headers,
    });
  }
  getStores() {
    return this.http.get(`${environment.apiUrl}/api/store`);
  }
  getPromoCodes() {
  return this.http.get('http://78.142.47.247:3003/api/promocode');
}
  getCategories(store_id: number) {
    return this.http.get(
      `${environment.apiUrl}/api/category?store_id=${store_id}`,
    );
  }

  getDishes(store_id: number) {
    return this.http.get(`${environment.apiUrl}/api/dish?store_id=${store_id}`);
  }

  createFee(feeData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${environment.apiUrl}/api/settings/conditionalfee`,
      feeData,
      {
        headers,
      },
    );
  }

  savePickupService(pickupData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${environment.apiUrl}/api/settings/pickupservice`,
      pickupData,
      { headers },
    );
  }

  saveDeliveryService(deliveryData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${environment.apiUrl}/api/settings/deliveryservice`,
      deliveryData,
      { headers },
    );
  }

  // // ---------- Working Hours ----------
  // getWorkingHours(storeId: number): Observable<any[]> {
  //   const headers = this.getAuthHeaders();
  //   return this.http
  //     .get<any>(`${this.baseUrl}/store/${storeId}`, { headers })
  //     .pipe(
  //       map((store) => {
  //         try {
  //           return JSON.parse(store.working_hours); // backend stores as string
  //         } catch {
  //           return [];
  //         }
  //       })
  //     );
  // }

  // updateWorkingHours(storeId: number, workingHours: any[]): Observable<any> {
  //   const headers = this.getAuthHeaders();

  //   const payload = {
  //     type: "update",
  //     store_id: storeId,
  //     working_hours: workingHours,
  //   };

  //   const formData = new FormData();
  //   formData.append("body", JSON.stringify(payload));

  //   return this.http.post(`${this.baseUrl}/store`, formData, { headers });
  // }
  // GET working hours (array of {type, day, from, to})

  // ---------- Working Hours ----------
  getWorkingHours(storeId: number): Observable<any> {
    const payload = { type: "get", store_id: storeId };

    const formData = new FormData();
    formData.append("body", JSON.stringify(payload));

    return this.http.post<any>(`${environment.apiUrl}/api/store`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Update working hours (minimal required fields)
  updateWorkingHours(storeId: number, workingHours: any[]): Observable<any> {
    const payload = {
      type: "update",
      store_id: storeId,
      working_hours: workingHours,
    };

    console.log("Update Working Hours Payload:", payload);

    const formData = new FormData();
    formData.append("body", JSON.stringify(payload));

    return this.http.post(`${environment.apiUrl}/api/store`, formData, {
      headers: this.getAuthHeaders(),
    });
  }
}
