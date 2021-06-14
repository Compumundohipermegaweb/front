import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PurchaseOrder } from '../purchase-orders/purchase-orders.component';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private HOST = environment.apiHost
  private BASE_URL = "/api/purchase-orders"

  constructor(private http: HttpClient) { }

  getAll(): Observable<GetAllPurchaseOrders> {
    return this.http.get<GetAllPurchaseOrders>(this.HOST + this.BASE_URL)
  }
}

export interface GetAllPurchaseOrders {
  purchase_orders: PurchaseOrder[]
}
