import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../service/order.service';
import { Order } from '../service/order.service';
import Swal  from 'sweetalert2';
import { BranchService  } from '../service/branch.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-online-sales',
  templateUrl: './online-sales.component.html',
  styleUrls: ['./online-sales.component.css']
})
export class OnlineSalesComponent implements OnInit {
  dataSource: MatTableDataSource<Order>
  displayedColumns: String[]
  itemsControl: FormControl;


  constructor(private saleService: OrderService, private changeDetector: ChangeDetectorRef, private branchService: BranchService) { 
    this.displayedColumns =  ['id', 'sale_id', 'state', 'shipping_price', 'shipping_company', 'items_detail'] //datos de venta online
    this.initDatasource()
    this.itemsControl = new FormControl()
  }

  ngOnInit(): void {
  }

  initDatasource(){
    this.dataSource = new MatTableDataSource();

    this.saleService.getOrders(this.branchService.selectedBranch)
      .subscribe(
        (response) => {
          this.dataSource.data = response.Orders
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar las categorías"
          })
        }
      )
  }

}




