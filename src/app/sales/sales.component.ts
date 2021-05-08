import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sale, SaleResponse, SalesService } from './service/sales.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[];
  dataSource = new MatTableDataSource<Item>();
  items: Item[];
  totalCost: number;
  saleResponse: SaleResponse;

  constantsForm: FormGroup;
  itemForm: FormGroup;
  paymentForm: FormGroup;

  invoiceTypeControl: FormControl;
  salesmanControl: FormControl;
  branchControl: FormControl;
  idControl: FormControl;
  skuControl: FormControl;
  detailControl: FormControl;
  quantityControl: FormControl;
  priceControl: FormControl;
  paymentMethodControl: FormControl;
  paymentAmountControl: FormControl;

  constructor(private formBuilder: FormBuilder, private changeDetectorRefs: ChangeDetectorRef, private salesService: SalesService) {
    this.initColumns();
    this.initItems();
    this.initControls();
    this.initForms(formBuilder);
  }

  ngOnInit(): void {
  }

  initColumns() {
    this.displayedColumns = ["id", "sku", "detail", "quantity", "price", "subTotal"]
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
    this.detailControl = new FormControl("");
    this.quantityControl = new FormControl("");
    this.priceControl = new FormControl("");
    this.paymentMethodControl = new FormControl("CASH")
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
      detail: this.detailControl,
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
      this.calculateTotalCost()
    } else {
      this.constantsForm.markAllAsTouched()
    }
  }

  calculateTotalCost() {
    if(this.items.length > 0) {
      this.totalCost = this.items.map(i => i.price * i.quantity ).reduce((a, b) => a + b);
    } else {
      return 0
    }
  }

  registerSale(){
    this.invoiceSale()
    this.initItems()
    this.refreshDataSource();
  }

  cancelSale() {
    this.initItems()
    this.refreshDataSource();
  }

  private refreshDataSource(){
    this.dataSource.data = this.items
  }

  private invoiceSale() {
    const sale = this.createRequest()
    this.saleResponse = this.salesService.postSale(sale)
  }

  private createRequest(): Sale {
    return {
      invoiceType: this.invoiceTypeControl.value,
      client: {
        name: "Cliente casual",
        document: {
          type: "DNI",
          value: "00000000",
        },
        invoice_address: ""
      },
      salesman: {
        code: this.salesmanControl
    .value
      },
      branch: {
        id: this.branchControl.value
      },
      detail: this.items,
      payment_details: [
        { type: "CASH", amount: this.items.map(i => i.price * i.quantity).reduce((a, b) => a + b) }
      ]
    }
  }
}

export interface Item {
  id: String;
  sku: Number;
  detail: String;
  quantity: number;
  price: number;
}
