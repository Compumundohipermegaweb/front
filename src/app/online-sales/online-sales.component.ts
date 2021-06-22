import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-online-sales',
  templateUrl: './online-sales.component.html',
  styleUrls: ['./online-sales.component.css']
})
export class OnlineSalesComponent implements OnInit {

  dataSource: MatTableDataSource<Order>
  displayedColumns: String[]


  constructor(private saleService: OrderService, private changeDetector: ChangeDetectorRef) { 
    this.displayedColumns =  ['id', 'sku', 'amount', 'supplier', 'status'] //datos de venta online
    this.initDatasource()
  }

  ngOnInit(): void {
  }

  initDatasource(){

  }

}

export interface Order{
  id: number;
  sale_id: number;
  state: Status;
  shipping_price: number;
  shipping_company: String;
  items_detail: number;
}

export interface ItemSaleDetail{
  id: number;
  description: String;
  quantity: number;
  unit_price: number;
}

export enum Status {
  PENDING = "PENDING", 
  ACCEPTED = "ACCEPTED", 
  CONFIRMED = "CONFIRMED", 
  REJECTED = "REJECTED"
}
