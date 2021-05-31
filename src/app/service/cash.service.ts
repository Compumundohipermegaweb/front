import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cash } from 'src/app/cash/cash.component';

@Injectable({
  providedIn: 'root'
})
export class CashService {
  
  apiHost = environment.apiHost;
  startCashUrl = "/api/cash/start";
  endCashUrl ="/api/cash/end" ;
  allCashUrl ="/api/cash/all" ;


constructor(private http: HttpClient) { }

  getAllCash(): Observable<AllCashResponse> {
    return this.http.get<AllCashResponse>(this.apiHost + this.allCashUrl);
  }

  open(cash: OpenRequest): Observable<Cash> {
    return this.http.post<Cash>(this.apiHost + this.startCashUrl, cash)
  }

}
export interface AllCashResponse {
  cards: CashResponse[];
}

export interface CashResponse {
  cash_id: number;
  branch_id: number;
  point_of_sale: number;
  status: String
}
export interface OpenRequest{
  cash_id: number;
  user_id: number;
  opening_balance: number
}