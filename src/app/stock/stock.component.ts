import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})


export class StockComponent implements OnInit, AfterViewInit {


  EXAMPLE_DATA: MyTableItem[] = [
    {id: 15, descripcion: 'Marillo', cantidad: 99}
  ]

  EXAMPLE_DATAMI: MyTableItemMI[] = [
    {id: 98, sku: 315, descripcionL: 'Destornillador Phillips Grueso', descripcionC: 'Destornillador Phillips', costo: 250, precio: 500, estado: 'no hay'}
  ]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MyTableItem>;
  @ViewChild(MatPaginator) paginatorMI!: MatPaginator;
  @ViewChild(MatSort) sortMI!: MatSort;
  @ViewChild(MatTable) tableMI!: MatTable<MyTableItemMI>;
  dataSource = new MatTableDataSource<MyTableItem>();
  dataSourceMI = new MatTableDataSource<MyTableItemMI>();

  displayedColumns = ['id', 'descripcion', 'cantidad'];
  displayedColumnsMI = ['id', 'sku', 'descripcionL', 'descripcionC', 'costo', 'precio', 'estado'];

  constructor(private changeDetectorRefs: ChangeDetectorRef) {
    this.dataSource.data = this.EXAMPLE_DATA;
    this.dataSourceMI.data = this.EXAMPLE_DATAMI;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSourceMI.sort = this.sortMI;
    this.dataSourceMI.paginator = this.paginatorMI;
  }
}

export interface MyTableItem {
  id: number;
  descripcion: String;
  cantidad: number;
}

export interface MyTableItemMI {
  id: number;
  sku: number;
  descripcionL: String;
  descripcionC: String;
  costo: number;
  precio: number;
  estado: String;
}
