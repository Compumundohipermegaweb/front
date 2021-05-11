import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Item, Sale } from './sales.model';
import { SalesService } from './service/sales.service';
import Swal  from 'sweetalert2';

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
  totalCost: number;

  constantsForm: FormGroup;
  itemForm: FormGroup;
  paymentForm: FormGroup;

  invoiceTypeControl: FormControl;
  salesmanControl: FormControl;
  branchControl: FormControl;
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
              private router: Router) {
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
    this.salesmanControl = new FormControl("");
    this.branchControl = new FormControl("");
    this.idControl = new FormControl("");
    this.skuControl = new FormControl("");
    this.descriptionControl = new FormControl("");
    this.quantityControl = new FormControl("");
    this.priceControl = new FormControl("");
    this.paymentMethodControl = new FormControl("EFECTIVO")
    this.paymentAmountControl = new FormControl("");
    this.paymentAmountControl.disable()
  }

  initForms(formBuilder: FormBuilder) {
    this.constantsForm = formBuilder.group({
      invoice: this.invoiceTypeControl,
      seller: this.salesmanControl,
      branchId: this.branchControl
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

  addItem() {
    if(this.itemForm.valid && this.constantsForm.valid) {
      this.items.push(this.itemForm.value)
      this.itemForm.reset()
      this.refreshDataSource();
      this.calculateTotalCost();
      this.paymentAmountControl.setValue(this.totalCost);
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
    console.log(this.paymentAmountControl.value)

    return {
      invoiceType: this.invoiceTypeControl.value,
      client: { name: "Cliente frecuente" },
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
