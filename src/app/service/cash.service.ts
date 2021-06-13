import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cash } from '../cash/cash.component';
import { Payment, PaymentMethod} from '../add-payment-method/add-payment-method.component';
import { ClientResponse } from '../service/client.service';




@Injectable({
  providedIn: 'root'
})
export class CashService {
  
  apiHost = environment.apiHost;
  startCashUrl = "/api/cash/start";
  endCashUrl = "/api/cash/end" ;
  allCashUrl = "/api/cash/all" ;
  startEndByUser = '/api/cash/start-end?user_id={user_id}';
  incomesUrl = '/api/cash/cash/income?cash_start_end_id={cash_start_end_id}';
  allTransactionUrl = '/api/cash/transaction/all?cash_start_end_id={cash_start_end_id}';
  expensesUrl = '/api/cash/cash/expense?cash_start_end_id={cash_start_end_id}';
  paymentsUrl  = '/api/cash/payment-details/update?movement_id={movement_id}';
  totalUrl = '/api/cash/total-movement?branch_id={branch_id}';


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

  buildUrlIncomes(cashStartEndId  :number): String{
    return this.incomesUrl.replace(/{cash_start_end_id}/gi, cashStartEndId.toString());
  }

  buildUrlExpenses(cashStartEndId  :number): String{
    return this.expensesUrl.replace(/{cash_start_end_id}/gi, cashStartEndId.toString());
  }

  buildUrlPayments(movementId  :number): String{
    return this.paymentsUrl.replace(/{movement_id}/gi, movementId.toString());
  }

  buildUrlTotal(branchId  :number): String{
    return this.totalUrl.replace(/{branch_id}/gi, branchId.toString());
  }

  getCashOpenByUser(userId :number): Observable<CashStarEndIdResponse>{
    return this.http.get<CashStarEndIdResponse>(this.apiHost + this.buildUrlCashOpenByUser(userId));
  }

  getIncomes(cashStartEndId: number): Observable<IncomesResponse> {
    return this.http.get<IncomesResponse>(this.apiHost + this.buildUrlIncomes(cashStartEndId));
   
  }

  getExpenses(cashStartEndId: number): Observable<ExpensesResponse> {
    return this.http.get<ExpensesResponse>(this.apiHost + this.buildUrlExpenses(cashStartEndId));
  }

  getTotal(branchId: number): Observable<TotalsResponse> {
    return this.http.get<TotalsResponse>(this.apiHost + this.buildUrlTotal(branchId));
  }

  payMovement(movementId: number, payments: PaymentRequest[]): Observable<boolean> {
    return this.http.post<boolean>(this.apiHost + this.buildUrlPayments(movementId), payments)
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
  id_movement: number;
  datetime: number;
  source_id: number;
  source_description: String;
  detail: String;
  payments?: Payment[];
  amount: number;
  salesman_id: number;
  client?: ClientResponse
  transaction_id: number;//Id de la Venta
}

export interface IncomesResponse{
    incomes: IncomeResponse[]
}

export interface ExpenseResponse{
  id_movement: number;
  datetime: Date;
  transaction_id: number;
  source_description: String;
  detail: String;
  payment: String;
  amount: number
}

export interface ExpensesResponse{
    expenses: ExpenseResponse[]
}

export interface PaymentRequest{
  method: PaymentMethod;
  sub_total: number;
  card_id?: number;
  lastDigits?: String;
  email?: String;
}

export interface TotalResponse{
  branch_id: String,
  cash_id: String,
  cash_start_end_id: number,
  date: Date,
  movement_type: String,
  source: String,
  payment_method: String,
  card: String,
  total: number
}

export interface TotalsResponse{
    totals: TotalResponse[]
}


