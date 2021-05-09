import { Component, OnInit } from '@angular/core';
import { SaleResponse } from '../sales/service/sales.service';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.css']
})
export class SaleInvoiceComponent implements OnInit {

  saleResponse: SaleResponse

  constructor() {}

  ngOnInit(): void {
    if(history.state != null && history.state["data"] != null) {
      this.saleResponse = history.state["data"]
    }
  }

}
