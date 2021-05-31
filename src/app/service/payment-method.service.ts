import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentMethod } from '../payment-methods/payment-methods.component';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private HOST = environment.apiHost
  private BASE_URL = "/api/payment-methods"

  constructor(private http: HttpClient) { }

  findAll(): Observable<FindAllPaymentMethodsResponse> {
    return this.http.get<FindAllPaymentMethodsResponse>(this.HOST + this.BASE_URL)
  }
}

export interface FindAllPaymentMethodsResponse {
  payment_methods: PaymentMethod[]
}
