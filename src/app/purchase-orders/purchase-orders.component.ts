import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseService } from '../service/purchase.service';

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
  styleUrls: ['./purchase-orders.component.css']
})
export class PurchaseOrdersComponent implements OnInit {

  dataSource: MatTableDataSource<PurchaseOrder>
  displayedColumns: String[]

  constructor(private purchaseService: PurchaseService) {
    this.displayedColumns =  ['id', 'sku', 'amount', 'supplier', 'status']
    this.initDatasource()
  }

  ngOnInit(): void { }

  initDatasource() {
    this.dataSource = new MatTableDataSource()

    this.purchaseService.getAll()
      .subscribe(
        (response) => {
          this.dataSource.data = response.purchase_orders
        }
      )
  }

}

export interface PurchaseOrder {
  id: number;
  branch_id: number;
  sku: String;
  amount: number;
  supplier: String;
  status: Status;
  dispatch_id: number;
}

export enum Status {
  PENDING = "PENDING", 
  ACCEPTED = "ACCEPTED", 
  CONFIRMED = "CONFIRMED", 
  REJECTED = "REJECTED"
}
