import { ClientLookupDialogComponent } from '../client-lookup-dialog/client-lookup-dialog.component';

import { SalesService } from '../service/sale/sales.service';
import { ClientService } from '../service/client/client.service';

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
              private router: Router,
              public clientLookupDialog: MatDialog) {
    this.initColumns();
    this.initItems();
    this.initControls();
    this.initForms(formBuilder);
  }

  ngOnInit(): void {
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
    this.paymentMethodControl = new FormControl("EFECTIVO")
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
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
      }
    });
  }

  addItem() {
    if(this.itemForm.valid && this.constantsForm.valid) {
      this.items.push(this.itemForm.value)
      this.itemForm.reset()
      this.refreshDataSource();
      this.calculateTotalCost();
      this.paymentAmountControl.patchValue(this.totalCost);
    } else {
      this.constantsForm.markAllAsTouched()
    }
  }

  calculateTotalCost() {
    if(this.items.length > 0) {
      this.totalCost = this.items.map(i => i.price * i.quantity ).reduce((a, b) => a + b);
    } else { return 0 }
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
}
