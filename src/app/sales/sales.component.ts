import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Sale, SaleResponse, SalesService } from './service/sales.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator

  displayedColumns: string[] = ["id", "sku", "detail", "quantity", "price", "subTotal"];
  dataSource = new MatTableDataSource<Item>();
  items: Item[]

  constantsForm: FormGroup;
  itemForm: FormGroup;

  invoiceTypeControl = new FormControl("B");
  salesmanControl = new FormControl("");
  branchControl = new FormControl("");
  idControl = new FormControl("");
  skuControl = new FormControl("");
  detailControl = new FormControl("");
  quantityControl = new FormControl("");
  priceControl = new FormControl("");

  saleResponse: SaleResponse;

  constructor(private formBuilderl: FormBuilder, private changeDetectorRefs: ChangeDetectorRef, private salesService: SalesService) {
    this.initItems()

    this.constantsForm = formBuilderl.group({
      invoice: this.invoiceTypeControl,
      seller: this.salesmanControl,
      branchId: this.branchControl
    });

    this.itemForm = formBuilderl.group({
      id: this.idControl,
      sku: this.skuControl,
      detail: this.detailControl,
      quantity: this.quantityControl,
      price: this.priceControl
    });
  }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }

  addItem() {
    if(this.itemForm.valid && this.constantsForm.valid) {
      this.items.push(this.itemForm.value)
      this.itemForm.reset()
      this.refreshDataSource();
    } else {
      this.constantsForm.markAllAsTouched()
    }
  }

  getTotalCost() {
    if(this.items.length > 0) {
      return this.items.map(i => i.price * i.quantity ).reduce((a, b) => a + b);
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

  private initItems() {
    this.items = [];
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
