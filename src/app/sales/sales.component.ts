import { ClientLookupDialogComponent } from '../client-lookup-dialog/client-lookup-dialog.component';
import { ItemLookupDialogComponent } from '../item-lookup-dialog/item-lookup-dialog.component';

import { SalesService } from '../service/sale/sales.service';
import { CheckingAccountResponse, ClientService } from '../service/client/client.service';
import { ItemStockResponse, StockService, StockValidationResponse } from '../service/stock/stock.service';
import { CardResponse, CardService } from '../service/card/card.service';

import { Client, Item, Sale, Payment, PaymentType, PaymentMethod } from './sales.model';

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal  from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})

export class SalesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  fetchingData = false;

  displayedColumns: string[];
  dataSource = new MatTableDataSource<Item>();
  items: Item[];
  client: Client;
  totalCost: number;
  itemStock: StockValidationResponse;

  constantsForm: FormGroup;
  itemForm: FormGroup;
  paymentForm: FormGroup;

  invoiceTypeControl: FormControl;
  salesmanControl: FormControl;
  branchControl: FormControl;
  clientControl: FormControl;
  idControl: FormControl;
  skuControl: FormControl;
  descriptionControl: FormControl;
  quantityControl: FormControl;
  priceControl: FormControl;

  paymentMethodControl: FormControl;
  paymentAmountControl: FormControl;
  paymentTypeControl: FormControl;
  paymentLastDigitsControl: FormControl;
  paymentEmailControl: FormControl;

  paymentMethodDataSource = new MatTableDataSource()
  paymentMethodColumns: string[];

  clientPayments: Payment[]
  clientCheckingAccount: CheckingAccountResponse;

  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod;

  cardTypes: CardResponse[] = []
  selectedPaymentType: PaymentType;

  constructor(private formBuilder: FormBuilder,
              private changeDetectorRefs: ChangeDetectorRef,
              private salesService: SalesService,
              private clientService: ClientService,
              private stockService: StockService,
              private cardService: CardService,
              private router: Router,
              public clientLookupDialog: MatDialog,
              public itemLookupDialog: MatDialog,
              public paymentMethodDialog: MatDialog) {

    this.initColumns();
    this.initItems();
    this.initControls();
    this.initForms(formBuilder);
    this.initClientPayments();
    this.initCardTypes();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  initColumns() {
    this.displayedColumns = ["id", "sku", "description", "quantity", "price", "subTotal"]
    this.paymentMethodColumns = ["method", "amount", "type", "lastDigits", "email"];
  }

  initItems() {
    this.items = [];
  }

  initClientPayments() {
    this.clientPayments = [];
  }

  initControls() {
    this.invoiceTypeControl = new FormControl("B");
    this.salesmanControl = new FormControl();
    this.branchControl = new FormControl();
    this.clientControl = new FormControl();
    this.idControl = new FormControl();
    this.skuControl = new FormControl();
    this.descriptionControl = new FormControl();
    this.quantityControl = new FormControl();
    this.priceControl = new FormControl();
    this.paymentMethodControl = new FormControl();
    this.paymentAmountControl = new FormControl();
    this.paymentTypeControl = new FormControl();
    this.paymentLastDigitsControl = new FormControl();
    this.paymentEmailControl= new FormControl();

  }

  initForms(formBuilder: FormBuilder) {
    this.constantsForm = formBuilder.group({
      invoice: this.invoiceTypeControl,
      seller: this.salesmanControl,
      branchId: this.branchControl,
      client: this.clientControl
    });

    this.itemForm = formBuilder.group({
      id: this.idControl,
      sku: this.skuControl,
      description: this.descriptionControl,
      quantity: this.quantityControl,
      price: this.priceControl
    });

    this.paymentForm = formBuilder.group({
      method: this.paymentMethodControl,
      amount: this.paymentAmountControl,
      type: this.paymentTypeControl,
      lastDigits: this.paymentLastDigitsControl,
      email: this.paymentEmailControl
    });
  }

  loadAvailablePaymentMethods() {
    this.clientService.getClientPaymentMethods(this.client.id)
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
        this.cardTypes = response.cards;
      },

      (error) => {
        this.cardTypes = []
      }
    );
  }


  clientLookup() {
    this.fetchingData = true;
    this.clientService.getClient("", this.clientControl.value)
      .subscribe(
        (response) => {
          this.fetchingData = false;
          if(response && response.length == 1) {
            const client = response[0];
            this.client = {
              firstName: client.first_name,
              lastName: client.last_name,
              document: client.document_number,
              id: client.id
            }
          } else {
            this.clientControl.setErrors( { "incorrect": true } )
          }
        },

        (error) => {
          this.clientControl.setErrors( {"incorrect": true} )
          this.fetchingData = false;
        }
      );
  }

  getClientErrors(): String {
    if(this.clientControl.hasError("incorrect")) {
      return "Cliente inválido"
    }
  }

  searchClients() {
    const dialogRef = this.clientLookupDialog.open(ClientLookupDialogComponent, {
      data: { document: this.clientControl.value }
    });

    dialogRef.afterClosed().subscribe((result: Client) => {
      if(result != null) {
        this.clientControl.patchValue(result.document)
        this.client = result;
        this.loadAvailablePaymentMethods();
      }
    });
  }

  searchItems() {
    const dialogRef = this.itemLookupDialog.open(ItemLookupDialogComponent, { data: {
      branchId: this.branchControl.value
    }})

    dialogRef.afterClosed().subscribe((result: ItemStockResponse) => {
      if(result) {
        this.idControl.patchValue(result.id)
        this.skuControl.patchValue(result.sku)
        this.descriptionControl.patchValue(result.short_description)
        this.priceControl.patchValue(result.unit_price)
      }
    })
  }

  addItem() {

    if(this.itemForm.valid && this.constantsForm.valid) {
      this.items.push(this.itemForm.value)
      this.itemForm.reset()
      this.refreshDataSource();
      this.calculateTotalCost();
      this.paymentAmountControl.patchValue(this.totalCost)
    } else {
      this.constantsForm.markAllAsTouched()
    }
  }

  deleteItem(item: Item) {
    Swal.fire({
      icon: "question",
      title: "Seguro desea eliminar",
      text: item.quantity + "x" + item.description.toString(),
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#3f51b5",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#f44336"
    }).then((result) => {
      if(result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Item eliminado!",
          text: "Se ha eliminado " + item.quantity + "x" + item.description
        });

        this.items = this.items.filter((it: Item) => it.sku != item.sku)
        this.calculateTotalCost()
        this.refreshDataSource()
      }
    })
  }

  validateStock() {
    let request = {
      branchId: this.branchControl.value,
      sku: this.skuControl.value
    }
    
    if(this.quantityControl.value == null || this.quantityControl.value <= 0) {
      this.quantityControl.setErrors({"invalid": true});
      return;
    }

    if(!request.branchId || !request.sku) {
      this.quantityControl.setErrors({"required": true})
      return;
    }

    this.stockService.validateStock(request)
      .subscribe(
        (response: StockValidationResponse) => {
          this.itemStock = response;
          if(response.available_stock == 0) {
            this.quantityControl.setErrors({"unavailable": true});
          } else if(response.available_stock < this.quantityControl.value) {
            this.quantityControl.setErrors({"unavailable": true});
          } else {
            this.quantityControl.setErrors(null);
          }
        },

        (error) => {
          this.quantityControl.setErrors({"unavailable": true});
        }
      );
  }

  getQuantityErrors() {
    if(this.quantityControl.hasError("unavailable")) {
      return "Stock insuficiente. Disponible: " + this.itemStock.available_stock;
    } else if(this.quantityControl.hasError("invalid")){
      return "Cantidad inválida";
    } else if(this.quantityControl.hasError("required")) {
      return "Ingrese Sucursal y SKU";
    }
  }

  calculateTotalCost() {
    if(this.items && this.items.length > 0) {
      this.totalCost = this.items.map(i => i.price * i.quantity ).reduce((a, b) => a + b);
      this.totalCost = this.acotarDecimal(this.totalCost);
    } else {
      this.totalCost = 0;
    }
  }

  acotarDecimal(x) {
    var fixeado = Number.parseFloat(x).toFixed(2);
    var numero: number = +fixeado;
    return numero;
  }

  registerSale() {
    this.fetchingData = true;
    const sale = this.createRequest()
    this.salesService.postSale(sale)
      .subscribe(
        (response) => {
          this.router.navigateByUrl('/sales/invoice', { state: { data: response } })
        },
        (error) => {
          console.log(error)
          this.fetchingData = false;
          Swal.fire({
            icon: "error",
            title: "Venta fallida",
            text: "Si el error persiste contacte a un administrador"
          })
        }
      );
  }

  cancelSale() {
    this.initItems()
    this.refreshDataSource();
  }

  addPayment() {
    let payment: Payment = {
      method: this.selectedPaymentMethod,
      amount: this.paymentAmountControl.value
    }

    this.validatePaymentAmount()

    if(this.isCardPaymentMethod()) {
      this.validateCardFields()

      if(this.paymentTypeControl.valid) {
        payment.typeId = this.selectedPaymentType.id;
        payment.typeName = this.selectedPaymentType.name;
        payment.lastDigits = this.paymentLastDigitsControl.value;
      }
    }

    if(this.isMercadoPagoPaymentMethod()) {
      this.validateMercadoPagoFields()

      if(this.paymentEmailControl.valid) {
        payment.email = this.paymentEmailControl.value;
      }
    }

    if(this.isCheckingAccount()) {
      
      this.clientService.getClientBalance(this.client.id)
        .subscribe(
          (response) => {
            if(response == null) {
              this.invalidCheckingAccountMessage()
              this.paymentAmountControl.setErrors( { "invalid": true } )
            } else {
              if(response.balance < payment.amount) {
                this.paymentAmountControl.setErrors( { "insuficientFounds": true } )
              } else {
                this.paymentAmountControl.setErrors(null);
                this.clientCheckingAccount = response;
              }
            }
          },

          (error) => {
            this.invalidCheckingAccountMessage()
          }
        );
    }

    if(this.paymentForm.valid) {
      this.clientPayments.push(payment);
      this.paymentMethodDataSource.data = this.clientPayments;
  
      this.paymentForm.reset();
      if(this.totalCost == this.calculateCurrentSubtotal()) {
        this.paymentForm.setErrors(null)
      }
    }
  }

  invalidCheckingAccountMessage() {
    Swal.fire({
      icon: "error",
      title: "Cuenta invalida",
      text: "No se pudo encontrar la cuenta del cliente, por favor eliga otro medio de pago"
    })
  }

  validatePaymentAmount() {
    let currentSubTotal = this.calculateCurrentSubtotal() + this.paymentAmountControl.value

    if(this.paymentAmountControl.value == 0) {
      this.paymentAmountControl.setErrors({"invalid": true});
    }

    if(currentSubTotal > this.totalCost) {
      this.paymentAmountControl.setErrors({"exceeded": true});
    }
  }

  getPaymentAmountErrors() {
    if(this.paymentAmountControl.hasError("invalid")) {
      return "Monto inválido";
    } else if(this.paymentAmountControl.hasError("exceeded")) {
      return "El monto exede el total"
    } else if(this.paymentAmountControl.hasError("insuficientFounds")) {
      return "Fondos insuficientes. Disponible: " + this.clientCheckingAccount.balance;
    }
  }

  calculateCurrentSubtotal(): number {
    if(this.clientPayments && this.clientPayments.length > 0) {
      return this.clientPayments.map((it: Payment) => it.amount).reduce((a, b) => a + b)
    } else {
      return 0
    }
  }

  validatePayments() {
    if(this.totalCost != this.calculateCurrentSubtotal()) {
      this.paymentForm.setErrors({"mismatch": true});
    } else {
      this.paymentForm.setErrors(null);
    }
  }

  checkout(stepper: MatStepper) {
    if(this.totalCost == this.calculateCurrentSubtotal()) {
      stepper.next()
    } else {
      Swal.fire({
        icon: "error",
        title: "Pago insuficiente"
      });
    }
  }

  private validateCardFields() {
    if(this.paymentTypeControl.value == null || this.paymentTypeControl.value == undefined) {
      this.paymentTypeControl.setErrors({"required": true});
    }
    
    if(!this.paymentLastDigitsControl.value) {
      this.paymentLastDigitsControl.setErrors({"required": true});
    }
  }

  private validateMercadoPagoFields() {
    if(!this.paymentEmailControl.value) {
      this.paymentEmailControl.setErrors({"required": true})
    }
  }

  selectPaymentMethod(event) {
    let methodType = event.value;
    this.selectedPaymentMethod = this.paymentMethods.filter((it) => it.type == methodType)[0]
  }

  selectPaymentType(event) {
    this.selectedPaymentType = {
      id: event.value,
      name: event.source.triggerValue
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

  private refreshDataSource() {
    this.dataSource.data = this.items;
  }

  private createRequest(): Sale {

    return {
      invoiceType: this.invoiceTypeControl.value,
      client: {id: this.client.id, firstName: this.client.firstName, lastName: this.client.lastName, document: this.client.document},
      salesmanCode: this.salesmanControl.value,
      branchCode: this.branchControl.value,
      details: this.items,
      payment: this.clientPayments,
      total: this.totalCost
    }
  }

}
