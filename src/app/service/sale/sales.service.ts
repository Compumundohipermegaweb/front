import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Sale, Item, Payment } from '../../sales/sales.model';
import { SaleRequest, ClientRequest, SaleDetailsRequest, ItemRequest, PaymentRequest } from './sale-request.model';
import { SaleResponse } from './sale-response.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SalesService {

  host = environment.apiHost
  salesUrl = "/api/sales"

  constructor(private http: HttpClient) { }

  postSale(sale: Sale): Observable<SaleResponse> {
    const saleRequest = this.createRequest(sale);
    return this.http.post<SaleResponse>(this.host + this.salesUrl, saleRequest);
  }

  createRequest(sale: Sale): SaleRequest {
    const clientRequest: ClientRequest = {
      document_number: sale.client.document,
      first_name: sale.client.firstName,
      last_name: sale.client.lastName,
      state: "",
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
