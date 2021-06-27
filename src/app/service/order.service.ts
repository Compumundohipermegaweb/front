
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private HOST = environment.apiHost
  private BASE_URL = "/api/order"

  constructor(private http: HttpClient) { }

  getOrders(branch_id: number): Observable<Orders>{
    const requestParams = new HttpParams().set("branch_id", branch_id.toString());
    return this.http.get<Orders>(this.HOST + this.BASE_URL, { params: requestParams })
  }
}

export interface Orders{
  orders: Order[];
}

export interface Order {
  id: number;
  sale_id: number;
  state: Status;
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

export enum Status {
  PENDING = "PENDING", 
  ACCEPTED = "ACCEPTED", 
  CONFIRMED = "CONFIRMED", 
  REJECTED = "REJECTED"
}