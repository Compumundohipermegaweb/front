import { Component, OnInit, ViewChild ,Inject,ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StockService } from '../service/stock.service';
import Swal from 'sweetalert2';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditStockDialogComponent } from '../edit-stock-dialog/edit-stock-dialog.component';

@Component({
  selector: 'app-items-stock',
  templateUrl: './items-stock.component.html',
  styleUrls: ['./items-stock.component.css']
})
export class ItemsStockComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns = ['sku','description', 'stock_total', 'minimum_stock', 'security_stock','editar'];
  stock = new MatTableDataSource<Stock>()

  constructor(
    private stockService: StockService,
    public changeDetectorRef: ChangeDetectorRef,
    public editStockDialog: MatDialog,
    //@Inject(MAT_DIALOG_DATA) public data: EditStockDialogData,
  ) {
    this.loadStock(); 
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    
    this.stock.paginator = this.paginator; 
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

  editStockbyItem(stock: Stock) {
     const dialogRef = this.editStockDialog.open(EditStockDialogComponent, { data: stock});
     dialogRef.afterClosed().subscribe(stock => {
      if (stock != undefined)
        this.stock.data=null; 
        this.loadStock(); 
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.stock.filter = filterValue.trim().toLowerCase();
  }

}

export interface Stock{  
  id: number;
  sku: String;
  description: String;
  stock_total: number;
  minimum_stock: number;
  security_stock: number;

}

export interface EditStockDialogData {

}
