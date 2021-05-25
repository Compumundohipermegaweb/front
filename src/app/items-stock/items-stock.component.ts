import { Component, OnInit, ViewChild ,ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { StockService } from '../service/stock/stock.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-items-stock',
  templateUrl: './items-stock.component.html',
  styleUrls: ['./items-stock.component.css']
})
export class ItemsStockComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columns = ['sku','description', 'stock_total', 'minimum_stock', 'security_stock','editar'];
  stock = new MatTableDataSource<Stock>()

  constructor(
    private stockService: StockService,
    public changeDetectorRefs: ChangeDetectorRef
  ) {
    this.loadStock(); 
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    
    this.stock.paginator = this.paginator; 
    this.stock.sort = this.sort;
  }

  loadStock() {
    this.stockService.getStock(1)
      .subscribe(
        (response) => {
          this.stock.data = response.stocks;
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo cargar el Stock de la Sucursal"
          });
        }
      );
  }

}

export interface Stock{  
  id: number;
  sku: String;
//  description: String;
  stock_total: number;
  minimum_stock: number;
  security_stock: number;

}
