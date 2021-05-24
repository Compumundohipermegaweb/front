import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ItemService } from '../service/item/item.service';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css']
})
export class ItemMasterComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns = ["sku", "description", "price", "uom", "imported", "state"]
  items = new MatTableDataSource<MasterItem>();

  constructor(private itemService: ItemService) {
    this.loadItems();
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.items.paginator = this.paginator;
  }

  loadItems() {
    this.itemService.getMaster()
      .subscribe(
        (response) => {
          this.items.data = response.found_items;
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo cargar el maestro de items"
          });
        }
      );
  }

  formatImported(imported): String {
    if(imported) {
      return "SI";
    } else {
      return "NO";
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.items.filter = filterValue.trim().toLowerCase();
  }

}

export interface MasterItem {
  sku: number;
  description: String;
  short_description: String;
  price: number;
  cost: number;
  state: String;
  category_id: number;
  uom_sale: String;
  imported: boolean;
}
