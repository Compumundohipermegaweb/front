import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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

  invoiceTypeControl = new FormControl("A");
  sellerControl = new FormControl("");
  branchControl = new FormControl("");

  idControl = new FormControl("");
  skuControl = new FormControl("");
  detailControl = new FormControl("");
  quantityControl = new FormControl("");
  priceControl = new FormControl("");

  constructor(private formBuilderl: FormBuilder, private changeDetectorRefs: ChangeDetectorRef) {
    this.items = []

    this.constantsForm = formBuilderl.group({
      invoice: this.invoiceTypeControl,
      seller: this.sellerControl,
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
      this.dataSource.data = this.items
    }
  }

  getTotalCost() {
    if(this.items.length > 0) {
      return this.items.map(i => i.price * i.quantity ).reduce((a, b) => a + b);
    } else {
      return 0
    }
  }

}

export interface Item {
  id: String;
  sku: Number;
  detail: String;
  quantity: number;
  price: number
}
