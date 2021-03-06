import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StringValueToken } from 'html2canvas/dist/types/css/syntax/tokenizer';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentMethod, PaymentMethodType } from '../payment-methods/payment-methods.component';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private HOST = environment.apiHost
  private BASE_URL = "/api/payment-methods"
  private TYPES_URL = "/types"

  constructor(private http: HttpClient) { }

  getAll(): Observable<GetAllPaymentMethodsResponse> {
    return this.http.get<GetAllPaymentMethodsResponse>(this.HOST + this.BASE_URL)
  }

  delete(id: number) {
    return this.http.delete(this.HOST + this.BASE_URL + "/" + id)
  }

  update(paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    return this.http.put<PaymentMethod>(this.HOST + this.BASE_URL, paymentMethod)
  }

  getAllTypes(): Observable<GetAllPaymentMethodTypesResponse> {
    return this.http.get<GetAllPaymentMethodTypesResponse>(this.HOST + this.BASE_URL + this.TYPES_URL)
  }

  create(request: CreatePaymentMethodRequest): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(this.HOST + this.BASE_URL, request)
  }
}

export interface GetAllPaymentMethodsResponse {
  payment_methods: PaymentMethod[]
}

export interface GetAllPaymentMethodTypesResponse {
  types: PaymentMethodType[]
}

export interface CreatePaymentMethodRequest {
  payment_method: String;
  state: String;
  type: String;
}
