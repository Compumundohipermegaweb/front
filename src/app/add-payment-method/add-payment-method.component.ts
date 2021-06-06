import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FLAG_UNRESTRICTED } from 'html2canvas/dist/types/css/syntax/tokenizer';
import Swal from 'sweetalert2';
import { CardService } from '../service/card.service';
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

  payments: Payment[]

  paymentMethods: PaymentMethod[] = []
  cards: Card[] = []

  selectedPaymentMethod: PaymentMethod
  selectedCard: Card

  totalCost: number

  clientId: number= null
  clientCheckingAccount: CheckingAccountResponse = null
  isFounds: boolean= true;

  constructor(
    private clientService: ClientService,
    private cardService: CardService,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<AddPaymentMethodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddPaymentMethodData
  ) {

    this.paymentMethodColumns = ["method", "amount", "type", "lastDigits", "email"]
    this.paymentMethodDataSource = new MatTableDataSource()

    this.paymentMethodControl = new FormControl()
    this.amountControl = new FormControl()
    this.cardControl = new FormControl()
    this.lastDigitsControl = new FormControl()
    this.emailControl = new FormControl()

    this.paymentForm = formBuilder.group({
      paymentMethod: this.paymentMethodControl,
      amount: this.amountControl,
      card: this.cardControl,
      lastDigist: this.lastDigitsControl,
      email: this.emailControl
    })

    this.matDialogRef.disableClose = true
    this.clientId = data.clientId
    this.totalCost = data.total
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
    this.payments = [];
  }

  calculateCurrentSubtotal(): number {
    if(this.payments && this.payments.length > 0) {
      return this.payments.map((it: Payment) => it.amount).reduce((a, b) => a + b)
    } else {
      return 0
    }
  }

  selectPaymentMethod(event) {
    let methodType = event.value;
    this.selectedPaymentMethod = this.paymentMethods.filter((it) => it.type == methodType)[0]
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
    return this.paymentMethodControl.value == "TARJETA";
  }

  isMercadoPagoPaymentMethod() {
    return this.paymentMethodControl.value == "ONLIE";
  }

  isCheckingAccount() {
    return this.paymentMethodControl.value == "CUENTA_CORRIENTE";
  }
  
  add() {
    let payment: Payment = {
      method: this.selectedPaymentMethod,
      amount: this.amountControl.value
    }

    this.validatePaymentAmount()

    if(this.isCardPaymentMethod()) {
      this.validateCardFields()

      if(this.cardControl.valid) {
        payment.typeId = this.selectedCard.id;
        payment.typeName = this.selectedCard.name;
        payment.lastDigits = this.lastDigitsControl.value;
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
              if(response.balance < payment.amount) {    
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
     if(this.isCheckingAccount() && (this.clientCheckingAccount.balance < payment.amount)){
       console.log("Supera el balance")

     }else{
    
        if(this.paymentForm.valid) {
            let alreadyUsedPaymentMethod = this.payments.some((it) => it.method.id == payment.method.id && it.typeId == payment.typeId 
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
    this.payments.find((it) => it.method.id == payment.method.id && it.typeId == payment.typeId).amount += payment.amount;
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
      this.matDialogRef.close(this.payments)
    }
  }

  close() {
    this.matDialogRef.close()
  }

}

export interface AddPaymentMethodData {
  clientId: number;
  total: number;
}

export interface Payment {
  method: PaymentMethod;
  amount: number;
  typeId?: number;
  typeName?: String;
  lastDigits?: number;
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
