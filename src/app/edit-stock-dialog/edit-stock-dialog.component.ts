import { Component, Input, OnInit } from '@angular/core';
import { Stock } from 'src/app/items-stock/items-stock.component';

@Component({
  selector: 'app-edit-stock-dialog',
  templateUrl: './edit-stock-dialog.component.html',
  styleUrls: ['./edit-stock-dialog.component.css'],
})
export class EditStockDialogComponent implements OnInit {
  @Input() sku: String='789789789789'
  @Input() stockTotal: number=150

  selectedItemStock: Stock;
  constructor(
  ) { }

  ngOnInit(): void {
  }

  reduceStockItem(){}

  increaseStockItem(){}

}
