import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from '../sales/sales.model';
import { ItemResponse, SaleResponse } from '../sales/service/sale-response.model';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.css']
})
export class SaleInvoiceComponent implements OnInit {

  displayedColumns: string[];
  dataSource = new MatTableDataSource<Item>();
  totalCost: number;

  saleResponse: SaleResponse

  constructor(private changeDetectorRefs: ChangeDetectorRef) {
    this.displayedColumns = ["quantity", "detail", "price", "subTotal"]
    
  }

  ngOnInit(): void {
    if(history.state != null && history.state["data"] != null) {
      this.saleResponse = history.state["data"]
    }
    
    this.dataSource.data = this.saleResponse.saleDetails.sale_details.map(it => this.toItem(it))
    this.totalCost = this.dataSource.data.map((item: Item) => item.quantity * item.price).reduce((a, b) => a + b)
  }

  toItem(itemResponse: ItemResponse): Item {
    return {
      id: itemResponse.id,
      sku: 0,//TODO: se tiene que devolver el SKU
      description: itemResponse.desscription,
      quantity: itemResponse.quantity,
      price: itemResponse.unit_price
    }
  }
}
