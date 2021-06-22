import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Sale, Item } from '../../sales/sales.model';
import { SaleRequest, ClientRequest, SaleDetailsRequest, ItemRequest, PaymentRequest } from './sale-request.model';
import { SaleResponse } from './sale-response.model';
import { environment } from 'src/environments/environment';
import { Payment } from 'src/app/add-payment-method/add-payment-method.component';
import { ClientResponse } from 'src/app/service/client.service';


@Injectable({
  providedIn: 'root'
})

export class SalesService {

  host = environment.apiHost
  salesUrl = "/api/sales"  
  clientBySaleUrl ='/api/sales/client?sale_id={sale_id}'

  constructor(private http: HttpClient) { }

  postSale(sale: Sale): Observable<SaleResponse> {
    const saleRequest = this.createRequest(sale);
    return this.http.post<SaleResponse>(this.host + this.salesUrl, saleRequest);
  }

  createRequest(sale: Sale): SaleRequest {
    const clientRequest: ClientRequest = {
      id: sale.client.id,
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
      payments: sale.payment.map(it => this.toPaymentRequest(it)),
      discount: null
    }

    if(sale.discount.percentage > 0) {
      saleDetails.discount = {
        percentage: sale.discount.percentage,
        amount: Math.round(sale.discount.amount * 100) / 100
      }
    }

    return {
      invoice_type: sale.invoiceType,
      client: clientRequest,
      salesman_id: sale.salesmanCode,
      branch_id: sale.branchCode,
      sale_details: saleDetails,
      category: "LOCAL"
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
      type: payment.method.type,
      sub_total: payment.sub_total
    }
  } 

  buildUrlClientBySale(saleId: number): String{
    return this.clientBySaleUrl.replace(/{sale_id}/gi, saleId.toString());
  }
  
  getClientBySale(saleId: number): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(this.host + this.buildUrlClientBySale(saleId));
  }

}
