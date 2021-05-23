import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})


export class StockComponent implements OnInit, AfterViewInit {


  EXAMPLE_DATA: MyTableItem[] = [
    {id: 15, descripcion: 'Marillo', cantidad: 99}
  ]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MyTableItem>;
  @ViewChild(MatPaginator) paginatorMI!: MatPaginator;
  dataSource = new MatTableDataSource<MyTableItem>();

  displayedColumns = ['id', 'descripcion', 'cantidad'];
  displayedColumnsMI = ['id', 'sku', 'descripcionL', 'descripcionC', 'costo', 'precio', 'estado'];

  constructor(private changeDetectorRefs: ChangeDetectorRef) {
    this.dataSource.data = this.EXAMPLE_DATA;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}

export interface MyTableItem {
  id: number;
  descripcion: String;
  cantidad: number;
}
