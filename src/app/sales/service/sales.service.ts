import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Sale, Item, Payment } from '../sales.model';
import { SaleRequest, ClientRequest, SaleDetailsRequest, ItemRequest, PaymentRequest } from './sale-request.model';
import { SaleResponse } from './sale-response.model';


@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http: HttpClient) { }

  postSale(sale: Sale): Observable<SaleResponse> {
    const saleRequest = this.createRequest(sale);
    return this.http.post<SaleResponse>("https://pp1-hefesto-api-dev.herokuapp.com/api/sales", saleRequest);
  }

  createRequest(sale: Sale): SaleRequest {
    const clientRequest: ClientRequest = {
      document_number: "00000000",
      first_name: "Cliente",
      last_name: "Ocacional",
      sur_name: "",
      category: "Sin categoria",
      email: "",
      contact_number: ""
    }

    const saleDetails: SaleDetailsRequest = {
      details: sale.details.map(it => this.toItemRequest(it)),
      payments: sale.payment.map(it => this.toPaymentRequest(it))
    }

    return {
      invoice_type: sale.invoiceType,
      client: clientRequest,
      salesman_id: sale.salesmanCode,
      branch_id: sale.branchCode,
      sale_details: saleDetails
    }
  }

  toItemRequest(item: Item): ItemRequest {
    return {
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.price
    }
  }

  toPaymentRequest(payment: Payment): PaymentRequest {
    return {
      type: payment.method,
      sub_total: payment.amount
    }
  }
}
