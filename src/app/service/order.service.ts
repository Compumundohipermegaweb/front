import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from '../online-sales/online-sales.component';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private HOST = environment.apiHost
  private BASE_URL = "/api/order"

  constructor(private http: HttpClient) { }

  getOrders(branchId: number): Observable<GetAllOrders>{
    return this.http.get<GetAllOrders>(this.HOST + this.BASE_URL, branchId)
  }
}

export interface GetAllOrders {
  orders: Order[]
}