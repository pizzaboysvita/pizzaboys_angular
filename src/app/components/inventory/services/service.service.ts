import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private baseUrl = 'http://78.142.47.247:3003/api';   // Base URL
  private inventoryUrl = `${this.baseUrl}/settings/inventory`;  // Inventory endpoint

  constructor(private http: HttpClient) {}

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** 🔹 GET all inventory items */
  getInventory(token: string): Observable<any> {
    return this.http.get(this.inventoryUrl, { headers: this.getHeaders(token) });
  }

  /** 🔹 POST insert inventory */
  addInventory(payload: any, token: string): Observable<any> {
    const body = { type: 'insert', ...payload };
    return this.http.post(this.inventoryUrl, body, { headers: this.getHeaders(token) });
  }

  /** 🔹 PUT update inventory */
  updateInventory(itemId: number, payload: any, token: string): Observable<any> {
    const body = { type: 'update', item_id: itemId, ...payload };
    return this.http.post(this.inventoryUrl, body, { headers: this.getHeaders(token) });
  }

  /** 🔹 DELETE inventory item */
  deleteInventory(itemId: number, token: string): Observable<any> {
    return this.http.delete(`${this.inventoryUrl}/${itemId}`, { headers: this.getHeaders(token) });
  }
}
