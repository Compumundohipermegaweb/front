import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { NewItemDialogComponent } from '../new-item-dialog/new-item-dialog.component';
import { ItemService } from '../service/item.service';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css']
})
export class ItemMasterComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns = ["sku", "description", "price", "cost", "uom", "imported", "state"]
  items = new MatTableDataSource<MasterItem>();

  constructor(
    private itemService: ItemService, 
    public newItemDialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef
  ) {
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

  newItem() {
    const dialogRef = this.newItemDialog.open(NewItemDialogComponent, { });

    dialogRef.afterClosed()
      .subscribe(
        (result: MasterItem[]) => {
          if(result != null && result.length > 0) {
            result.forEach(element => {
              this.items.data.push(element);
            });
            this.changeDetectorRef.detectChanges();
          }
        }
      );
  }

  delete(item: MasterItem){
    
    Swal.fire({
      icon: "question",
      title: "Seguro desea eliminar",
      text: item.description.toString(),
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#3f51b5",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#f44336"
    }).then((result) => {
      if(result.isConfirmed) {
        this.itemService.deleteItem(item.sku.toString())
          .subscribe(
            (response) => {
              Swal.fire({
                icon: "success",
                title: "Item eliminado!",
                text: "Se ha eliminado " + item.description
              });

              this.items.data = this.items.data.filter((it) => it.sku != item.sku);
              this.changeDetectorRef.detectChanges();
            },

            (error) => {
              Swal.fire({
                icon: "error",
                title: "No se pudo eliminar",
                text: "Intentelo nuevamente, si el error persiste contacte un administrador"
              });
            }
          );
      }
    });
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
