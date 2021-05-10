import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Item } from '../sales/sales.component';
import { SaleResponse } from '../sales/service/sales.service';

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
    
    this.dataSource.data = this.saleResponse.detail
    this.totalCost = this.saleResponse.detail.map((item: Item) => item.quantity * item.price).reduce((a, b) => a + b)
  }
}
