import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cash } from '../cash/cash.component';


@Injectable({
  providedIn: 'root'
})
export class CashService {
  
  apiHost = environment.apiHost;
  startCashUrl = "/api/cash/start";
  endCashUrl ="/api/cash/end" ;
  allCashUrl ="/api/cash/all" ;
  startEndByUser ='/api/cash/start-end?user_id={user_id}';
  incomeUrl ='/api/cash/ cash/income?cash_start_end_id={cash_start_end_id}';
  allTransactionUrl ='/api/cash/transaction/all?cash_start_end_id={cash_start_end_id}';


constructor(private http: HttpClient) { }

  getAllCash(): Observable<AllCashResponse> {
    return this.http.get<AllCashResponse>(this.apiHost + this.allCashUrl);
  }

  open(cash: OpenRequest): Observable<CashResponse> {
    return this.http.post<CashResponse>(this.apiHost + this.startCashUrl, cash)
  }

  close(cash: CloseRequest): Observable<CashResponse> {
    return this.http.post<CashResponse>(this.apiHost + this.endCashUrl, cash)
  }

  buildUrlCashOpenByUser(userId :number): String{
  return this.startEndByUser.replace(/{user_id}/gi, userId.toString());
  }

  getCashOpenByUser(userId :number): Observable<CashStarEndIdResponse>{
    return this.http.get<CashStarEndIdResponse>(this.apiHost + this.buildUrlCashOpenByUser(userId));
  }
}
export interface AllCashResponse {
  cash_registers: Cash[];
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

export interface CloseRequest{
  cash_id: number;
  user_id: number;
  real_balance: number;
  theoretical_balance: number
}   

export interface CashStarEndIdResponse{
  cash_start_end_id: number
}

export interface IncomeResponse{
  id_movement: number,
  datetime: Date,
  transaction: String,
  detail: String,
  payment: String,
  amount: number
}

export interface IncomesResponse{
    incomes: IncomeResponse[]
}