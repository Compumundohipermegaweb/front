import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css']
})
export class ItemMasterComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  EXAMPLE_DATA: MasterItem[] = [
    {id: 98, sku: 315, long_description: 'Destornillador Phillips Grueso', short_description: 'Destornillador Phillips', cost: 250, price: 500, state: 'no hay'}
  ]

  columns = ["id", "sku", "long_description", "short_description", "cost", "price", "state"]
  items = new MatTableDataSource<MasterItem>();

  constructor() {
    this.items.data = this.EXAMPLE_DATA;
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.items.paginator = this.paginator;
  }

  addItem() {
    this.EXAMPLE_DATA.push({id: 98, sku: 315, long_description: 'Destornillador Phillips Grueso', short_description: 'Destornillador Phillips', cost: 250, price: 500, state: 'no hay'});
    this.items.data = this.EXAMPLE_DATA;
  }

}

export interface MasterItem {
  id: number;
  sku: number;
  long_description: String;
  short_description: String;
  cost: number;
  price: number;
  state: String;
}
