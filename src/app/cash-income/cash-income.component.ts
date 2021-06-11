import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Payment, AddPaymentMethodComponent, Card } from '../add-payment-method/add-payment-method.component';
import { PaymentMethod } from '../payment-methods/payment-methods.component';
import { CardService } from '../service/card.service';
import { CashService } from '../service/cash.service';
import { ClientResponse } from '../service/client.service';
import { PaymentMethodService } from '../service/payment-method.service';

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
  paymentMethods: PaymentMethod[] = []
  cards: Card[] = []
  cashOpened: number= 0;
  constructor(
    private addPaymentMethodDialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    private cashService: CashService,
    private cardService: CardService,
    private paymentMethodService: PaymentMethodService,
  ) { 
     this.cashOpened = 1;
     this.initPaymentMethodTypes();
     this.initCardTypes()
     this.loadIncomes();
  }

  ngOnInit() {
  }
  
  ngAfterViewInit(): void {   
    this.incomes.paginator = this.paginator; 
  }

  initPaymentMethodTypes() {
    this.paymentMethodService.getAll()
      .subscribe(
        (response) => {
          this.paymentMethods = response.payment_methods
        }
      )
  }

  initCardTypes() {
    this.cardService.getActiveCards()
    .subscribe(
      (response) => {
        this.cards = response.cards;
      },
      (error) => {
        this.cards = []
      }
    );
  }

  loadIncomes() {
    this.cashService.getIncomes(this.cashOpened)
      .subscribe(
        (response) => {
        //  console.log(JSON.stringify(response))
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

      const dialogRef = this.addPaymentMethodDialog.open(AddPaymentMethodComponent, { data:
         { movementId: cashMovement.id_movement, clientId: cashMovement.client.id, client: cashMovement.client, total: cashMovement.amount , payments: cashMovement.payments} })

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

  findCardName(id : number): String{
    let card =this.cards.find((it) => it.id ==id)
    return card?.name
  }

  findPaymentMethodDescription(id : number): String{
    let payment = this.paymentMethods.find((it) => it.id ==id)
    return payment?.description
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


