import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CardService } from '../service/card.service';
import { CashService } from '../service/cash.service';
import { CheckingAccountResponse, ClientResponse, ClientService } from '../service/client.service';
import { CashSummaryComponent } from '../cash-summary/cash-summary.component';

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
  caHistoryAmount: number = 0
 

  constructor(
    private clientService: ClientService,
    private cardService: CardService,
    private cashService: CashService,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<AddPaymentMethodComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: AddPaymentMethodData,
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
    this.getBalance(this.clientId)

    
  
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
    this.caHistoryAmount = this.payments?.filter((it) => it.method.id ==5)[0]?.sub_total || 0

    console.log(this.caHistoryAmount)
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

    let paymentMethod =this.paymentMethods.find((it) => it.id == this.paymentMethodControl.value);

    if(paymentMethod?.type == "CUENTA_CORRIENTE"){
      if(this.amountControl.value >= this.clientCheckingAccount.balance){
        this.amountControl.setErrors({"exceeded": true});
        Swal.fire({
          icon: "error",
          title: "Cantidad Invalida",
          text: "El cliente no tiene suficiente credito disponible"
        })
      }
    }

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

  getBalance(client : number){

  this.clientService.getClientBalance(this.clientId)
        .subscribe(
          (response) => {
           console.log(JSON.stringify(response))
            if(response == null) {
              console.log("sin cuenta")
            } else {
              this.clientCheckingAccount = response;
            }
          },
          (error) => {
            console.log("Error al traer cuenta")
            this.invalidCheckingAccountMessage()
          }
        );
  }
  
  add() {
    let paymentNew: Payment = {
      method: this.selectedPaymentMethod,
      sub_total: this.amountControl.value
    }

    this.validatePaymentAmount()

    if(this.isCardPaymentMethod()) {
      this.validateCardFields()

      if(this.cardControl.valid) {
        paymentNew.card_id = this.selectedCard.id;
        paymentNew.card_name = this.selectedCard.name;
        paymentNew.last_digits = this.lastDigitsControl.value;
      }
    }

    if(this.isMercadoPagoPaymentMethod()) {
      this.validateMercadoPagoFields()

      if(this.emailControl.valid) {
        paymentNew.email = this.emailControl.value;
      }
    }

    if(this.paymentForm.valid) {
      let alreadyUsedPaymentMethod = this.payments.some((it) => it.method.id == paymentNew.method.id && it.card_id == paymentNew.card_id 
                                                                  && (paymentNew.method.type=="EFECTIVO"||paymentNew.method.type=="CUENTA_CORRIENTE"));

      if(!alreadyUsedPaymentMethod ) {
        this.addNewPaymentMethod(paymentNew)
      } else {
        this.appendPaymentMethod(paymentNew)
      }
      this.paymentMethodDataSource.data = this.payments;

      this.paymentForm.reset();
      if(this.totalCost == this.calculateCurrentSubtotal()) {
        this.paymentForm.setErrors(null)
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

  addNewPaymentMethod(paymentNew) {
    this.payments.push(paymentNew);
  }

  appendPaymentMethod(paymentNew) {  
    this.payments.find((it) => it.method.id == paymentNew.method.id && it.card_id == paymentNew.card_id).sub_total += paymentNew.sub_total;
  }

  delete(payment :Payment){ 
    this.paymentMethodDataSource.data = this.paymentMethodDataSource.data.filter((it) => !( it.method.id==payment.method.id && it.card_id==payment.card_id &&  
                                                                                           it.sub_total==payment.sub_total && it.last_digits==payment.last_digits))
    this.payments = this.payments.filter((it) => !( it.method.id==payment.method.id && it.card_id==payment.card_id &&  
                                                    it.sub_total==payment.sub_total && it.last_digits==payment.last_digits))
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
      return "Fondos insuficientes. Disponible: " + (this.clientCheckingAccount.balance + this.caHistoryAmount);
    }
  }

  verifyCAPayment(){
    console.log("Verifica")
    let amountCA = this.payments?.find((it) => it.method.type == "CUENTA_CORRIENTE")?.sub_total
    if ((this.clientCheckingAccount.balance + this.caHistoryAmount) < amountCA){
      console.log("Fondos insuficientes")
      this.amountControl.setErrors({"insuficientFounds": true});
      this.getPaymentAmountErrors();
      return false
    }
    return true

  }

  checkout() {
    if(this.totalCost != this.calculateCurrentSubtotal()) {
      Swal.fire({
        icon: "error",
        title: "Pago insuficiente"
      })

    } else {

      if( this.clientCheckingAccount.id != null) {
        console.log("Tiene Cuenta")
        if (!this.verifyCAPayment()){
          return false 
        }
      }
   
      console.log("payments: "+JSON.stringify(this.payments))

      this.cashService.payMovement(this.movementId, this.payments)
      .subscribe(
        (response) => {
         console.log(JSON.stringify(response))
          if(response) {
            this.matDialogRef.close(this.payments)
          }else{
            Swal.fire({
              icon: "error",
              title: "Algunos pagos fueron rechazados. Refresque la pagina e Intente cargar el/los pagos faltantes"
            })
            this.matDialogRef.close()
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
    let payment =this.paymentMethods.find((it) => it.id ==id)
    return payment?.description
  }

  
}

export interface AddPaymentMethodData {
  clientId: number;
  total: number; 
  payments: Payment[];
  movementId: number;
  client: ClientResponse
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
