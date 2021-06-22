import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private HOST = environment.apiHost
  private BASE_URL = "/api/order"

  constructor(private http: HttpClient) { }

  /*getOrders(branch_id: number): Observable<Orders>{
    return this.http.get<Orders>(this.HOST + this.BASE_URL, branch_id)
  }*/
}

export interface Orders{
  Orders: Order[];
}

export interface Order {
  id: number;
  sale_id: number;
  state: String;
  shipping_price: number;
  shipping_company: String;
  items_detail: sale_details;
}

export interface sale_details{
  sale_details: Item[]
}

export interface Item{
  id: number;
  description: String;
  quantity: number;
  unit_price: number;
}