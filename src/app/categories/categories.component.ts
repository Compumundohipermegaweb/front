import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  EXAMPLE_DATA: Category[] = [
    { id: 0, name: "Pintureria", description: "Productos de pintureria"},
    { id: 0, name: "Electronica", description: "Cables, transistores, leds, lamparitas, etc."},
    { id: 0, name: "Carpinteria", description: "Clavos, martillos, lijas, etc."},
    { id: 0, name: "Pintureria", description: "Productos de pintureria"},
    { id: 0, name: "Pintureria", description: "Productos de pintureria"}
  ]

  categoriesDatasource: MatTableDataSource<Category>
  displayedColumns: String[]

  constructor(private addCategoryDialog: MatDialog) {
    this.displayedColumns = ["name", "description", "actions"]
    this.categoriesDatasource = new MatTableDataSource<Category>(this.EXAMPLE_DATA)
   }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.categoriesDatasource.filter = filterValue.trim().toLowerCase();
  }

  add() {
    const dialogRef = this.addCategoryDialog.open(AddCategoryDialogComponent, { });

    dialogRef.afterClosed()
      .subscribe(
        (result: Category) => {
          this.categoriesDatasource.data.push(result)
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo crear la categoria"
          })
        }
      )
  }

}

export interface Category {
  id: number;
  name: String;
  description: String;
}
