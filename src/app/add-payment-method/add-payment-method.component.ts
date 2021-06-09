import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CardService } from '../service/card.service';
import { CashService } from '../service/cash.service';
import { CheckingAccountResponse, ClientService } from '../service/client.service';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.css']
})
export class AddPaymentMethodComponent implements OnInit {

  paymentMethodColumns: String[]
  paymentMethodDataSource: MatTableDataSource<Payment>

  paymentForm: FormGroup
  paymentMethodControl: FormControl
  amountControl: FormControl
  cardControl: FormControl
  lastDigitsControl: FormControl
  emailControl: FormControl

  clientId: number = null
  payments: Payment[]
  movementId: number = null
  selectedPaymentMethod: PaymentMethod
  selectedCard: Card
  totalCost: number

  paymentMethods: PaymentMethod[] = []
  cards: Card[] = []

  clientCheckingAccount: CheckingAccountResponse = null
  isFounds: boolean= true;

  constructor(
    private clientService: ClientService,
    private cardService: CardService,
    private cashService: CashService,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<AddPaymentMethodComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: AddPaymentMethodData
  ) {

    this.paymentMethodColumns = ["method", "amount", "type", "lastDigits", "email", "actions"]
    this.paymentMethodDataSource = new MatTableDataSource<Payment>();

    this.paymentMethodControl = new FormControl()
    this.amountControl = new FormControl()
    this.cardControl = new FormControl()
    this.lastDigitsControl = new FormControl()
    this.emailControl = new FormControl()

    this.paymentForm = this.formBuilder.group({
      paymentMethod: this.paymentMethodControl,
      amount: this.amountControl,
      card: this.cardControl,
      lastDigist: this.lastDigitsControl,
      email: this.emailControl
    })

    this.matDialogRef.disableClose = true
    this.clientId = data.clientId
    this.totalCost = data.total
    this.payments = data.payments
    this.movementId = data.movementId
    this.clientCheckingAccount = {
      id: null,
      balance: null
    }  
    
    this.loadAvailablePaymentMethods()
    this.initCardTypes()
    this.initClientPayments()
  }

  ngOnInit(): void {
  }

  loadAvailablePaymentMethods() {
    this.clientService.getClientPaymentMethods(this.clientId)
      .subscribe(
        (response) => {
          if(response == null) {
            this.paymentMethods = [
              { id: 0, description: "Efectivo", type: "EFECTIVO" }
            ]
          } else {
            this.paymentMethods = response.payment_methods;
          }
        }
      );
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

  initClientPayments() {
    this.paymentMethodDataSource.data =this.payments
   }

  calculateCurrentSubtotal(): number {
    if(this.payments && this.payments.length > 0) {
      return this.payments.map((it: Payment) => it.sub_total).reduce((a, b) => a + b)
    } else {
      return 0
    }
  }

  selectPaymentMethod(event) {
    let methodType = event.value;
    this.selectedPaymentMethod = this.paymentMethods.filter((it) => it.id == methodType)[0]
  }


  selectCard(event) {
    this.selectedCard = {
      id: event.value,
      name: event.source.triggerValue
    }
  }

  validatePaymentAmount() {
    let currentSubTotal = this.calculateCurrentSubtotal() + this.amountControl.value

    if(this.amountControl.value == 0) {
      this.amountControl.setErrors({"invalid": true});
    }

    if(currentSubTotal > this.totalCost) {
      this.amountControl.setErrors({"exceeded": true});
    }
  }

  isCardPaymentMethod() {

    let paymentMethod =this.paymentMethods.find((it) => it.id == this.paymentMethodControl.value);
    if(paymentMethod?.type== "TARJETA"){
      return true
    }else{
      return false
    }

  }

  isMercadoPagoPaymentMethod() {
    let paymentMethod =this.paymentMethods.find((it) => it.id == this.paymentMethodControl.value);
    if(paymentMethod?.type== "ONLINE"){
      return true
    }else{
      return false
    }
  }

  isCheckingAccount() {
    let paymentMethod =this.paymentMethods.find((it) => it.id == this.paymentMethodControl.value);
    if(paymentMethod?.type== "CUENTA_CORRIENTE"){
      return true
    }else{
      return false
    }
  }
  
  add() {
    let payment: Payment = {
      method: this.selectedPaymentMethod,
      sub_total: this.amountControl.value
    }

    this.validatePaymentAmount()

    if(this.isCardPaymentMethod()) {
      this.validateCardFields()

      if(this.cardControl.valid) {
        payment.card_id = this.selectedCard.id;
        payment.card_name = this.selectedCard.name;
        payment.last_digits = this.lastDigitsControl.value;
      }
    }

    if(this.isMercadoPagoPaymentMethod()) {
      this.validateMercadoPagoFields()

      if(this.emailControl.valid) {
        payment.email = this.emailControl.value;
      }
    }

    if(this.isCheckingAccount()) {

      this.clientService.getClientBalance(this.clientId)
        .subscribe(
          (response) => {
           console.log(JSON.stringify(response))
            if(response == null) {
              this.invalidCheckingAccountMessage()
              this.amountControl.setErrors( { "invalid": true } )
            } else {
              this.clientCheckingAccount = response;
              if(response.balance < payment.sub_total) {    
                this.amountControl.setErrors( { "insuficientFounds": true } )
              } else {
                this.amountControl.setErrors(null);
                          
              }
            }
          },

          (error) => {
            this.invalidCheckingAccountMessage()
          }
        );
    }
     if(this.isCheckingAccount() && (this.clientCheckingAccount.balance < payment.sub_total)){
       console.log("Supera el balance")

     }else{
    
        if(this.paymentForm.valid) {
            let alreadyUsedPaymentMethod = this.payments.some((it) => it.method.id == payment.method.id && it.card_id == payment.card_id 
                                                                     && (payment.method.type=="EFECTIVO"||payment.method.type=="CUENTA_CORRIENTE"));

        if(!alreadyUsedPaymentMethod ) {
          this.addNewPaymentMethod(payment)
        } else {
          this.appendPaymentMethod(payment)
        }
        this.paymentMethodDataSource.data = this.payments;

        this.paymentForm.reset();
        if(this.totalCost == this.calculateCurrentSubtotal()) {
          this.paymentForm.setErrors(null)
        }
     }
    }
  }
  

  private validateCardFields() {
    if(this.cardControl.value == null || this.cardControl.value == undefined) {
      this.cardControl.setErrors({"required": true});
    }

    if(!this.lastDigitsControl.value) {
      this.lastDigitsControl.setErrors({"required": true});
    }
  }

  private validateMercadoPagoFields() {
    if(!this.emailControl.value) {
      this.emailControl.setErrors({"required": true})
    }
  }

  addNewPaymentMethod(payment) {
    this.payments.push(payment);
  }

  appendPaymentMethod(payment) {  
    this.payments.find((it) => it.method.id == payment.method.id && it.card_id == payment.typeId).sub_total += payment.amount;
  }

  delete(payment :Payment){  

    let paymentMethod =this.paymentMethods.find((it) => it.id == this.paymentMethodControl.value);
    if(payment.method.type== "CUENTA_CORRIENTE"){
      this.clientCheckingAccount.balance+=payment.sub_total;
      console.log()
    }
    this.paymentMethodDataSource.data = this.paymentMethodDataSource.data.filter((it) => it.method != payment.method)
    this.payments = this.payments.filter((it) => it.method != payment.method)
    this.changeDetectorRef.detectChanges()
  }
  
  invalidCheckingAccountMessage() {
    Swal.fire({
      icon: "error",
      title: "Cuenta invalida",
      text: "No se pudo encontrar la cuenta del cliente, por favor eliga otro medio de pago"
    })
  }

  getPaymentAmountErrors() {
    if(this.amountControl.hasError("invalid")) {
      return "Monto inválido";
    } else if(this.amountControl.hasError("exceeded")) {
      return "El monto exede el total"
    } else if(this.amountControl.hasError("insuficientFounds")) {
      return "Fondos insuficientes. Disponible: " + this.clientCheckingAccount.balance;
    }
  }

  checkout() {
    if(this.totalCost != this.calculateCurrentSubtotal()) {
      Swal.fire({
        icon: "error",
        title: "Pago insuficiente"
      })
    } else {
      console.log("payments: "+JSON.stringify(this.payments))

      this.cashService.payMovement(this.movementId, this.payments)
      .subscribe(
        (response) => {
         console.log(JSON.stringify(response))
          if(response) {
            this.matDialogRef.close(this.payments)
          } 
        },

        (error) => {

          Swal.fire({
            icon: "error",
            title: "No se pudo realizar el pago, valide los datos"
          })

        }
      );

    }
  }

  close() {
    this.matDialogRef.close()
  }

  findCardName(id : number): String{
    let card =this.cards.find((it) => it.id ==id)
    return card?.name
  }

  findPaymentMethodDescription(id : number): String{
    console.log(id)
    let payment =this.paymentMethods.find((it) => it.id ==id)
    return payment?.description
  }

  

}

export interface AddPaymentMethodData {
  clientId: number;
  total: number; 
  payments: Payment[];
  movementId: number;
}

export interface Payment {
  method: PaymentMethod;
  sub_total: number;
  card_id?: number;
  card_name?: String;
  last_digits?: String;
  email?: String;
}

export interface PaymentMethod {
  id: number;
  description: String;
  type: String;
}

export interface Card
{
  id: number;
  name: String;
}
