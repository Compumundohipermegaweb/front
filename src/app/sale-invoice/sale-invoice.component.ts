import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Item } from '../sales/sales.model';
import { ItemResponse, SaleResponse } from '../service/sale/sale-response.model';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.css']
})
export class SaleInvoiceComponent implements OnInit {

  displayedColumns: string[];
  dataSource = new MatTableDataSource<Item>();
  totalCost: number;
  discount: number
  totalSinIva: number;
  iva: number
  percentIva: number; 
  percentDiscountIva: number;

  saleResponse: SaleResponse

  constructor(private changeDetectorRefs: ChangeDetectorRef, private router: Router) {
    this.displayedColumns = ["quantity", "detail","iva", "price", "subtotal"]

    let data = this.router.getCurrentNavigation().extras.state.data
    
    if(data) {
      this.saleResponse = data

      this.dataSource.data = this.saleResponse.sale_details.sale_details.map((it: ItemResponse) => this.toItem(it))


      this.totalCost = this.dataSource.data
        .map( (item: Item) => item.quantity * item.price)
        .reduce((a, b) => a + b)
      
      this.discount = this.totalCost - this.saleResponse.total

      if (this.saleResponse.type=='A') {  
        this.totalSinIva = this.totalCost * 0.79
        this.iva = this.totalCost * 0.21
        this.percentDiscountIva = 0.79
      } else {
        //Para no alterar los valores
        this.percentDiscountIva = 1
      }

     
    }
  }

  ngOnInit(): void {
  }

  toItem(itemResponse: ItemResponse): Item {
    return {
      id: itemResponse.id,
      sku: 0,
      description: itemResponse.description,
      quantity: itemResponse.quantity,
      price: itemResponse.unit_price
    }
  }
}
