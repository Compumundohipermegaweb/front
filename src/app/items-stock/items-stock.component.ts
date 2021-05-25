import { Component, OnInit, ViewChild ,ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StockService } from '../service/stock/stock.service';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-items-stock',
  templateUrl: './items-stock.component.html',
  styleUrls: ['./items-stock.component.css']
})
export class ItemsStockComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  EXAMPLE_DATA: Stock[] = [
    {id: 15, descripcion: 'Marillo', cantidad: 99}
  ]

  columns = ['id', 'descripcion', 'cantidad'];
  stock = new MatTableDataSource<Stock>()

  constructor(private changeDetectorRefs: ChangeDetectorRef) {
    this.stock.data = this.EXAMPLE_DATA;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.stock.sort = this.sort;
    this.stock.paginator = this.paginator;
  }

}

export interface Stock{
  id: number;
  descripcion : String;
  cantidad: number;
}