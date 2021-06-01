import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { NewPaymentMethodComponent } from '../new-payment-method/new-payment-method.component';
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

  descriptionControl: FormControl
  typeControl: FormControl
  stateControl: FormControl

  paymentMethodsTypes: PaymentMethodType[] = []

  constructor(
    private paymentMethodService: PaymentMethodService,
    private changeDetectorRef: ChangeDetectorRef,
    public newPaymentMethodDialog: MatDialog
  ) {
    this.descriptionControl = new FormControl()
    this.typeControl = new FormControl()
    this.stateControl = new FormControl()

    this.displayedColumns = ["description", "type", "state", "actions"]

    this.initDataSource()
    this.initPaymentMethodTypes()
  }

  ngOnInit(): void {
  }

  initDataSource() {
    this.dataSource = new MatTableDataSource()

    this.paymentMethodService.getAll()
      .subscribe(
        (response) => {
          this.dataSource.data = response.payment_methods
        },

        (error) => {
          this.fetchDataFailed = true
        }
      )
  }

  initPaymentMethodTypes() {
    this.paymentMethodService.getAllTypes()
      .subscribe(
        (response) => {
          this.paymentMethodsTypes = response.types
        }
      )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isActive(paymentMethod: PaymentMethod): Boolean {
    return paymentMethod.state == "ACTIVE"
  }

  add() {
    const dialogRef = this.newPaymentMethodDialog.open(NewPaymentMethodComponent, { });

    dialogRef.afterClosed()
      .subscribe(
        (result: PaymentMethod[]) => {
          if(result && result.length > 0) {
            this.dataSource.data.forEach(
              (paymentMethod: PaymentMethod) => {
                result.push(paymentMethod)
              }
            )
            this.dataSource.data = result
          }
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo crear la categoria"
          })
        }
      )
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
    paymentMethod.editing = !paymentMethod.editing
  }

  saveChanges(paymentMethod: PaymentMethod) {
    debugger
    let changes = {
      description: this.descriptionControl.value,
      type: this.typeControl.value,
      state: this.getState()
    }

    if(changes.description == null && changes.type == null && changes.state == null) {
      return;
    }

    if(changes.description) { paymentMethod.description = changes.description }
    if(changes.type) { paymentMethod.type = changes.type }
    if(changes.state) { paymentMethod.state = changes.state }

    this.paymentMethodService.update(paymentMethod)
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: "¡Cambios guardados!"
          })
          this.descriptionControl.setValue(null)
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron guardar los cambios"
          })
        }
      )
  }

  getState(): String {
    if(this.stateControl.value) {
      return "ACTIVE"
    } else { 
      return "INACTIVE"
    }
  }

  toggleState(paymentMethod: PaymentMethod) {
    if(paymentMethod.state == "ACTIVE") {
      this.stateControl.setValue(false)
    } else {
      this.stateControl.setValue(true)
    }
  }

}

export interface PaymentMethod {
  id: number;
  type: PaymentMethodType;
  description: String;
  state: String;
  editing?: Boolean;
}

export enum PaymentMethodType {
  EFECTIVO, TARJETA, CUENTA_CORRIENTE, ONLINE, BANCARIO
}
