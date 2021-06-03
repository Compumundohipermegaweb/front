import { animate, state, style, transition, trigger } from '@angular/animations';
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
  styleUrls: ['./cash-income.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CashIncomeComponent implements OnInit {

  EXAMPLE_DATA: CashMovement[] = [
    {
      id: 1,
      client: {
        id: 11,
        firstName: "Simon",
        lastName: "Cervera",
        document: "33100234"
      },
      payments:[],
      movementType: "INGRESO",
      cashMovementSource: "Venta en local",
      salesmanId: 1,
      amount: 10000,
      description: "Factura nro. 19278361",
      movementDate: "Hoy"
    }
  ]

  EXAMPLE_DATA2: CashMovement = 
    {
      id: 0,
      client: {
        id: 50,
        firstName: "Ruben",
        lastName: "Sanchez",
        document: "33100190"
      },
      payments: [ { method: {
                            id: 1,
                            description: "Efectivo",
                            type: "EFECTIVO"
                            },
                    amount: 200,
                    typeId: 0,
                    typeName: null,
                    lastDigits: null,
                    email: null
                  }
      ],
      movementType: "INGRESO",
      cashMovementSource: "Venta en local",
      salesmanId: 1,
      amount: 2000,
      description: "Factura nro. 19278362",
      movementDate: "03 de Junio del 2021"
    }
  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns = ['client','paymentMethods','amount','source', 'description','actions'];
  incomes = new MatTableDataSource<CashMovement>()
  expandedElement: CashMovement | null;



  constructor(
    private addPaymentMethodDialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
  ) { 
    this.incomes = new MatTableDataSource(this.EXAMPLE_DATA)
    this.incomes.data.push(this.EXAMPLE_DATA2)
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
