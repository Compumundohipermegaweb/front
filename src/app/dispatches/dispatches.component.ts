import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseOrder, Status } from '../purchase-orders/purchase-orders.component';
import { Supplier } from '../service/supplier.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import Swal from 'sweetalert2';
import { DispatchService } from '../service/dispatch.service';
import { BranchService } from '../service/branch.service';

@Component({
  selector: 'app-dispatches',
  templateUrl: './dispatches.component.html',
  styleUrls: ['./dispatches.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ] )
  ]
})
export class DispatchesComponent implements OnInit {

  dataSource: MatTableDataSource<Dispatch>
  displayedColumns: String[]

  constructor(private dispatchService: DispatchService, private branchService: BranchService) {
    this.displayedColumns = ["id", "supplier", "total", "status", "action"]
    this.initDataSource()
  }

  ngOnInit(): void { }

  initDataSource() {
    this.dataSource = new MatTableDataSource()

    this.dispatchService.getAll()
      .subscribe(
        (response) => {
          this.dataSource.data = response.dispatches
        }
      )
  }

  confirmDelivery(dispatch: Dispatch) {
    Swal.fire({
      icon: "question",
      title: "Seguro desea confirmar la entrega?",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#3f51b5",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#f44336"
    }).then((result) => {
      if(result.isConfirmed) {
        this.dispatchService.confirm(dispatch.id, dispatch.total, this.branchService.selectedBranch)
          .subscribe(
            (success) => {
              dispatch.status = "CONFIRMED"
              Swal.fire({
                icon: "success",
                title: "Entrega confirmada!"
              })
            },

            (error) => {
              Swal.fire({
                icon: "error",
                title: "La caja se encuentra cerrada"
              })
            }
          )
      }
    })
  }

  reload() {
    this.initDataSource()
  }

}

export interface Dispatch {
  id: number
  supplier: Supplier
  total: number
  status: String
  purchase_orders: PurchaseOrder[]
}
