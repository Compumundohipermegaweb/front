import { Injectable } from '@angular/core';
import { Item } from '../sales.component';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor() { }

  postSale(sale: Sale): SaleResponse {
    return this.mockResponse(sale)
  }

  private mockResponse(sale: Sale): SaleResponse {
    const branch: BranchResponse = {
      address: "Calle falsa 123",
      contact: "+54 011 6914 0099",
      cuit: "30-12345678-0",
      gross_income: "00100023434599010",
      activity_since: Date.now().toString()
    }
    const total = sale.detail.map(i => i.price * i.quantity).reduce((a, b) => a + b)

    return {
      invoice_id: "0190191029309",
      invoice_type: sale.invoiceType,
      invoice_address: "Calle falsa 123",
      client: sale.client,
      branch: branch,
      detail: sale.detail,
      sub_total: null,
      iva: null,
      total: total
    }
  }
}

export interface Sale {
  invoiceType: String;
  client: Client;
  salesman: Salesman;
  branch: BranchRequest;
  detail: Item[];
  payment_details: Payment[];
}

export interface Client {
  name: String;
  document: ClientDocument;
  invoice_address: String;
}

export interface ClientDocument {
  type: String;
  value: String;
}

export interface Salesman {
  code: String;
}

export interface BranchRequest {
  id: String;
}

export interface BranchResponse {
  address: String;
  contact: String;
  cuit: String;
  gross_income: String;
  activity_since: String;
}

export interface Payment {
  type: String;
  amount: number;
}

export interface SaleResponse {
  invoice_id: String;
  invoice_type: String;
  invoice_address: String;
  client: Client;
  branch: BranchResponse;
  detail: Item[];
  sub_total: number
  iva: number
  total: number
}
