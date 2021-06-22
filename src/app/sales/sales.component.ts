import { ClientLookupDialogComponent } from '../client-lookup-dialog/client-lookup-dialog.component';
import { ItemLookupDialogComponent } from '../item-lookup-dialog/item-lookup-dialog.component';

import { SalesService } from '../service/sale/sales.service';
import { ClientService } from '../service/client.service';
import { ItemStockResponse, StockService, StockValidationResponse } from '../service/stock.service';

import { Client, Item, Sale } from './sales.model';

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal  from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { BranchService } from '../service/branch.service';
import { CashService } from '../service/cash.service';
import { RoleService } from '../service/role.service';
import { threadId } from 'node:worker_threads';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})

export class SalesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  fetchingData = false
  isCompleted = false
  cashOpen = false

  displayedColumns: string[];
  dataSource = new MatTableDataSource<Item>();
  items: Item[];
  client: Client;
  totalCost: number;
  discountedCost: number
  itemStock: StockValidationResponse;
  
  discount: number
  maxDiscount: number

  constantsForm: FormGroup;
  itemForm: FormGroup;

  invoiceTypeControl: FormControl;
  salesmanControl: FormControl;
  branchControl: FormControl;
  clientControl: FormControl;
  idControl: FormControl;
  skuControl: FormControl;
  descriptionControl: FormControl;
  quantityControl: FormControl;
  priceControl: FormControl;

  paymentMethodDataSource = new MatTableDataSource()
  paymentMethodColumns: string[];

  constructor(private formBuilder: FormBuilder,
              private changeDetectorRefs: ChangeDetectorRef,
              private salesService: SalesService,
              private clientService: ClientService,
              private stockService: StockService,
              private branchService: BranchService,
              private cashService: CashService,
              private roleService: RoleService,
              private router: Router,
              public clientLookupDialog: MatDialog,
              public itemLookupDialog: MatDialog,
              public paymentMethodDialog: MatDialog) {
    
    this.checkCashStatus()
    this.initColumns();
    this.initItems();
    this.initControls();
    this.initForms(formBuilder);
    this.discount = 0
    this.maxDiscount = 20
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  checkCashStatus() {
    this.cashService.getAllCash()
      .subscribe(
        (response) => {
          if(response.cash_registers) {
            let currentCash = response.cash_registers.find((it) => it.branch_id == this.branchService.selectedBranch)
            if(currentCash.status == "OPEN") {
              this.cashOpen = true
            }
          }

          if(!this.cashOpen) {
            Swal.fire({
              icon: "warning",
              title: "¡Caja cerrada!",
              text: "Realice la apertura de caja antes de registrar una venta"
            })
          }
        }
      )
  }

  initColumns() {
    this.displayedColumns = ["id", "sku", "description", "quantity", "price", "subTotal"]
  }

  initItems() {
    this.items = [];
  }

  initControls() {
    this.invoiceTypeControl = new FormControl();
    this.salesmanControl = new FormControl();
    this.branchControl = new FormControl(this.branchService.selectedBranch);
    this.branchControl.disable()
    this.clientControl = new FormControl();
    this.idControl = new FormControl();
    this.skuControl = new FormControl();
    this.descriptionControl = new FormControl();
    this.quantityControl = new FormControl();
    this.priceControl = new FormControl();


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

    if(this.itemExists()){
      Swal.fire({
        icon: "error",
        title: "Este item ya esta agregado",
      })
      return
    }

    if(this.itemForm.valid && this.constantsForm.valid) {
      this.items.push(this.itemForm.value)
      this.itemForm.reset()
      this.refreshDataSource();
      this.calculateTotalCost();
    } else {
      this.constantsForm.markAllAsTouched()
    }

  }

  itemExists(){
    return this.items.some((it) => it.id == this.itemForm.value.id)
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
        if(this.items.length == 0) {
          this.isCompleted = false
        }
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
    this.calculateDiscountedCost()
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
          this.router.navigateByUrl('/home/sales/invoice', { state: { data: response } })
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

  validateItems() {
    if(this.items.length == 0 ) {
      Swal.fire({
        icon: "warning",
        title: "Ingrese items antes de continuar"
      })
    } else {
      this.isCompleted = true
    }
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
      payment: [],
      total: this.acotarDecimal(this.discountedCost),
      discount: {
        id: 0,
        percentage: this.discount,
        amount: this.totalCost - this.discountedCost,
        saleId: 0
      }
    }
  }

  canApplyDiscount() {
    return this.roleService.isAdmin() || this.roleService.isManager() || this.roleService.isSupervisor()
  }

  changeDiscount() {
    (async () => {

      const { value: discount } = await Swal.fire({
        title: 'Ingrese el descuento',
        text: "Maximo: " + this.maxDiscount + "%",
        input: "number",
        inputValidator: (value) => {
          if(!value) {
            return "Debe ingresar un descuento"
          } else if(Number.parseInt(value) > this.maxDiscount) {
            return "¡El descuento es demasiado alto!"
          } else if(Number.parseInt(value) < 0) {
            return "¡El descuento no puede ser negativo!"
          }
        }
      })
      
      if (discount) {
        this.discount = discount
        this.calculateDiscountedCost()
      }
      
    })()
  }

  calculateDiscountedCost() {
    if(this.discount > 0) {
      this.discountedCost = this.totalCost - ((this.discount * this.totalCost) / 100)
    } else {
      this.discountedCost = this.totalCost
    }
  }
}
