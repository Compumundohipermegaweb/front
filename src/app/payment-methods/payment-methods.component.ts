import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
    private paymentMethodService: PaymentMethodService
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
