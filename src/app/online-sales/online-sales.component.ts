import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../service/order.service';
import { Order } from '../service/order.service';
import Swal  from 'sweetalert2';
import { BranchService  } from '../service/branch.service';
import { FormControl } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-online-sales',
  templateUrl: './online-sales.component.html',
  styleUrls: ['./online-sales.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class OnlineSalesComponent implements OnInit {
  dataSource: MatTableDataSource<Order>
  displayedColumns: String[]
  itemsControl: FormControl;
  expandedElement: Order | null;

  constructor(private saleService: OrderService, private changeDetector: ChangeDetectorRef, private branchService: BranchService) { 
    this.displayedColumns =  ['id', 'sale_id', 'state', 'shipping_price', 'shipping_company'] //datos de venta online
    this.itemsControl = new FormControl()
    this.initDatasource()
  }

  ngOnInit(): void {
  }

  initDatasource(){
    this.dataSource = new MatTableDataSource();

    this.saleService.getOrders(this.branchService.selectedBranch)
      .subscribe(
        (response) => {
         console.log(JSON.stringify(response)) 
          this.dataSource.data = response.orders
          console.log(JSON.stringify(this.dataSource.data )) 
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




