import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Payment, AddPaymentMethodComponent } from '../add-payment-method/add-payment-method.component';
import { CashService } from '../service/cash.service';
import { ClientResponse } from '../service/client.service';
import { SalesService } from '../service/sale/sales.service';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns = ['client','paymentMethods','amount','source', 'description','actions'];
  incomes = new MatTableDataSource<CashMovement>()
  expandedElement: CashMovement | null;

  constructor(
    private addPaymentMethodDialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    private cashService: CashService,
    private salesService: SalesService
  ) { 
    
     this.loadIncomes();
  }

  ngOnInit() {
  }
  
  ngAfterViewInit(): void {   
    this.incomes.paginator = this.paginator; 
  }

  loadIncomes() {
    this.cashService.getIncomes(1)
      .subscribe(
        (response) => {
          console.log(JSON.stringify(response))
          this.incomes.data = response.incomes;  
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar los ingresos de la Caja"
          });
        }
      );
  }

  addPaymentMethod(cashMovement: CashMovement) {

      const dialogRef = this.addPaymentMethodDialog.open(AddPaymentMethodComponent, { data: { clientId: cashMovement.client.id, total: cashMovement.amount , payments: cashMovement.payments} })

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
            text: "No se pudo crear el pago"
          })
        }
      )
  }
}

export interface CashMovement {
  id_movement: number;
  datetime: number;
  source_id: number;
  source_description: String;
  detail: String;
  payments?: Payment[];
  amount: number;
  salesman_id: number;
  client?: ClientResponse;
  transaction_id: number //Id de la Venta
}


