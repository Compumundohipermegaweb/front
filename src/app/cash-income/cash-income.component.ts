import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Payment, AddPaymentMethodComponent } from '../add-payment-method/add-payment-method.component';
import { Client } from '../sales/sales.model';

@Component({
  selector: 'app-cash-income',
  templateUrl: './cash-income.component.html',
  styleUrls: ['./cash-income.component.css']
})
export class CashIncomeComponent implements OnInit {

  EXAMPLE_DATA: CashMovement[] = [
    {
      id: 0,
      client: {
        id: 0,
        firstName: "Nombre",
        lastName: "Apellido",
        document: "40060441"
      },
      movementType: "INGRESO",
      cashMovementSource: "Venta en local",
      salesmanId: 1,
      amount: 1500,
      description: "Factura nro. 19278361",
      movementDate: "Hoy"
    }
  ]

  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns = ['client','paymentMethods','amount','source', 'description','actions'];
  incomes = new MatTableDataSource<CashMovement>()

  constructor(
    private addPaymentMethodDialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
  ) { 
    this.incomes = new MatTableDataSource(this.EXAMPLE_DATA)
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {   
    this.incomes.paginator = this.paginator; 
  }
  
  addPaymentMethod(cashMovement: CashMovement) {
    const dialogRef = this.addPaymentMethodDialog.open(AddPaymentMethodComponent, { data: { clientId: cashMovement.client.id, total: cashMovement.amount } })

    dialogRef.afterClosed()
    .subscribe(
      (result: Payment[]) => {
        if(result && result.length > 0) {
          cashMovement.payments = result
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
}

export interface CashMovement {
  id: number;
  client: Client;
  payments?: Payment[];
  movementType: String;
  cashMovementSource: String;
  salesmanId: number;
  amount: number;
  description: String;
  movementDate: String;
}
