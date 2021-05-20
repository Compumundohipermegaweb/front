import { ClientLookupDialogComponent } from '../client-lookup-dialog/client-lookup-dialog.component';
import { ItemLookupDialogComponent } from '../item-lookup-dialog/item-lookup-dialog.component';
import { AddPaymentMethodComponent } from '../add-payment-method/add-payment-method.component';

import { SalesService } from '../service/sale/sales.service';
import { ClientService } from '../service/client/client.service';
import { ItemStockResponse, StockService, StockValidationResponse } from '../service/stock/stock.service';

import { Client, Item, Sale } from './sales.model';

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal  from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';



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


  constructor(private formBuilder: FormBuilder,
              private changeDetectorRefs: ChangeDetectorRef,
              private salesService: SalesService,
              private clientService: ClientService,
              private stockService: StockService,
              private router: Router,
              public clientLookupDialog: MatDialog,
              public itemLookupDialog: MatDialog,
              public paymentMethodDialog: MatDialog) {

    this.initColumns();
    this.initItems();
    this.initControls();
    this.initForms(formBuilder);

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  initColumns() {
    this.displayedColumns = ["id", "sku", "description", "quantity", "price", "subTotal"]
  }

  initItems() {
    this.items = [];
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
    this.paymentMethodControl = new FormControl()
    this.paymentAmountControl = new FormControl();
    this.paymentAmountControl.disable()
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
      paymentMethod: this.paymentMethodControl,
      amount: this.paymentAmountControl
    });
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
              document: client.document_number
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
        this.client = result
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
    if(this.itemForm.valid && this.constantsForm.valid && this.quantityControl.valid) {
      this.items.push(this.itemForm.value)
      this.itemForm.reset()
      this.refreshDataSource();
      this.calculateTotalCost();
      this.paymentAmountControl.patchValue(this.totalCost);
      this.itemForm.reset()
    } else {
      this.constantsForm.markAllAsTouched()
    }
  }

  deleteItem(item: Item) {
    Swal.fire({
      icon: "warning",
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
    } else if(this.quantityControl.hasError("required")) {
      return "Ingrese Sucursal y SKU"
    }
  }

  calculateTotalCost() {
    if(this.items && this.items.length > 0) {
      this.totalCost = this.items.map(i => i.price * i.quantity ).reduce((a, b) => a + b);
    } else {
      this.totalCost = 0;
    }
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

  seleccionoTarjeta(){
    if(this.paymentMethodControl.value=="TARJETA"){

      window.alert("Se selecciono tarjeta");
    }
  }

  private refreshDataSource(){
    this.dataSource.data = this.items
  }

  private createRequest(): Sale {

    return {
      invoiceType: this.invoiceTypeControl.value,
      client: { firstName: this.client.firstName, lastName: this.client.lastName, document: this.client.document },
      salesmanCode: this.salesmanControl.value,
      branchCode: this.branchControl.value,
      details: this.items,
      payment: [
        {
          method: this.paymentMethodControl.value,
          amount: this.paymentAmountControl.value
        }
      ],
      total: this.totalCost
    }
  }

  eleccionDePago(){

    if(this.paymentMethodControl.value == "TARJETA"){
      document.getElementById("nt").removeAttribute('disabled');
      document.getElementById("ct").removeAttribute('disabled');
      document.getElementById("vt").removeAttribute('disabled');
    }else{
      document.getElementById("nt").setAttribute('disabled','disabled');
      document.getElementById("ct").setAttribute('disabled','disabled');
      document.getElementById("vt").setAttribute('disabled','disabled');
    }
  }


  addPaymentMethod() {
    this.paymentMethodDialog.open(AddPaymentMethodComponent, {
      data: { document:  this.paymentMethodControl.value}
    });
  }
}
