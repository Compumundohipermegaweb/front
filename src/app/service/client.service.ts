import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentMethod } from '../add-payment-method/add-payment-method.component';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  host = environment.apiHost
  clientsUrl = "/api/clients";
  checkingAccountBalanceUrl = "/api/clients/{client_id}/checking-account";
  paymentMethodsUrl = "/api/clients/{client_id}/payment-methods";
  getAllUrl = "/api/clients/all";
  checkingAccountUrl = '/api/checking-account';


  constructor(private http: HttpClient) { }

  getAll(): Observable<GetAllClientsResponse> {
    return this.http.get<GetAllClientsResponse>(this.host + this.getAllUrl);
  }

  getClient(name: string, document: string): Observable<ClientResponse[]> {
    const requestParams = new HttpParams().set("name", name).set("document", document);
    return this.http.get<ClientResponse[]>(this.host + this.clientsUrl, { params: requestParams });
  }

  getClientBalance(clientId: number): Observable<CheckingAccountResponse> {
    return this.http.get<CheckingAccountResponse>(this.host + this.buildCheckingAccountUrl(clientId))
  }

  getClientPaymentMethods(clientId: number): Observable<PaymentMethodResponse> {
    return this.http.get<PaymentMethodResponse>(this.host + this.buildPaymentMethodsUrl(clientId));
  }

  buildCheckingAccountUrl(clientId: number): String {
    return this.checkingAccountBalanceUrl.replace(/{client_id}/gi, clientId.toString());
  }

  buildPaymentMethodsUrl(clientId: number): String {
    return this.paymentMethodsUrl.replace(/{client_id}/gi, clientId.toString());
  }

  createCheckingAccount(checkingAccountRequest: CheckingAccountRequest): Observable<CheckingAccountResponse> {
    return this.http.post<CheckingAccountResponse>(this.host + this.checkingAccountUrl, checkingAccountRequest);
  }

  updateCreditLimit(checkingAccountRequest: CheckingAccountRequest): Observable<Boolean> {
    return this.http.put<Boolean>(this.host + this.checkingAccountUrl, checkingAccountRequest);
  }

  /*save(client: ClientRequest): Observable<ClientResponse> {
    return this.http.put<ClientResponse>(this.host  this.clientsUrl, client)
  }*/
  
}

export interface GetClientsParameters {
  name?: string;
  document?: string;
}

export interface ClientResponse {
  id: number;
  document_number: String;
  first_name: String;
  last_name: String;
  state: String;
  credit_limit: number;
  email: String;
  contact_number: String;
}

export interface ClientRequest {
  id: number;
  document_number: String;
  first_name: String;
  last_name: String;
  state: String;
  credit_limit: number;
  email: String;
  contact_number: String;
  address: String;
}

export interface CheckingAccountResponse {
  id: number;
  balance: number;
  balance_due: number;
  credit_limit: number;
}

export interface CheckingAccountRequest {
  client_id: number;
  credit_limit: number;
}

export interface PaymentMethodResponse {
  payment_methods: PaymentMethod[];
}

export interface GetAllClientsResponse {
  clients: ClientResponse[];
}
