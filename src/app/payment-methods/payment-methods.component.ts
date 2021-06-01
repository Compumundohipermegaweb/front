import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { PaymentMethodService } from '../service/payment-method.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {

  fetchDataFailed = false

  displayedColumns: String[]
  dataSource: MatTableDataSource<PaymentMethod>

  constructor(
    private paymentMethodService: PaymentMethodService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.displayedColumns = ["description", "type", "state", "actions"]
    this.initDataSource()
  }

  ngOnInit(): void {
  }

  initDataSource() {
    this.dataSource = new MatTableDataSource()

    this.paymentMethodService.findAll()
      .subscribe(
        (response) => {
          this.dataSource.data = response.payment_methods
        },

        (error) => {
          this.fetchDataFailed = true
        }
      )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  add() {
    /* Abrir dialog */
  }

  delete(paymentMethod: PaymentMethod) {
    
    Swal.fire({
      icon: "question",
      title: "Seguro desea eliminar",
      text: paymentMethod.description.toString(),
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#3f51b5",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#f44336"
    }).then((result) => {
      if(result.isConfirmed) {
        this.paymentMethodService.delete(paymentMethod.id)
          .subscribe(
            (response) => {
              Swal.fire({
                icon: "success",
                title: "Item eliminado!",
                text: "Se ha eliminado " + paymentMethod.description
              });

              this.dataSource.data = this.dataSource.data.filter((it) => it.id != paymentMethod.id)
              this.changeDetectorRef.detectChanges()
            },

            (error) => {
              Swal.fire({
                icon: "error",
                title: "No se pudo eliminar",
                text: "Intentelo nuevamente, si el error persiste contacte un administrador"
              })
            }
          )
      }
    })
  }

  toggleEdit(paymentMethod: PaymentMethod) {

  }

  saveChanges(paymentMethod: PaymentMethod) {

  }

}

export interface PaymentMethod {
  id: number,
  type: PaymentMethodType,
  description: String,
  state: String
}

export enum PaymentMethodType {
  EFECTIVO, TARJETA, CUENTA_CORRIENTE, ONLINE, BANCARIO
}
