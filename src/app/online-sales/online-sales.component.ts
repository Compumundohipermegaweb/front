import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SalesService } from '../service/sale/sales.service';

@Component({
  selector: 'app-online-sales',
  templateUrl: './online-sales.component.html',
  styleUrls: ['./online-sales.component.css']
})
export class OnlineSalesComponent implements OnInit {

  dataSource: MatTableDataSource<OnlineSale>
  displayedColumns: String[]


  constructor(private saleService: SalesService, private changeDetector: ChangeDetectorRef) { 
    this.displayedColumns =  ['id', 'sku', 'amount', 'supplier', 'status'] //datos de venta online
    this.initDatasource()
  }

  ngOnInit(): void {
  }

  initDatasource(){

  }

}

export interface OnlineSale{

  status: Status
}

export enum Status {
  PENDING = "PENDING", 
  ACCEPTED = "ACCEPTED", 
  CONFIRMED = "CONFIRMED", 
  REJECTED = "REJECTED"
}
