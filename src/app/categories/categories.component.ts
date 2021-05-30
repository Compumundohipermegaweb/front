import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { CategoryService } from '../service/category/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categoriesDatasource: MatTableDataSource<Category>
  displayedColumns: String[]

  constructor(private addCategoryDialog: MatDialog, private categoryService: CategoryService, public changeDetectorRef: ChangeDetectorRef) {
    this.initDataSource()
    this.displayedColumns = ["name", "description", "actions"]
  }

  ngOnInit(): void {
  }

  initDataSource() {
    this.categoriesDatasource = new MatTableDataSource()

    this.categoryService.findAll()
      .subscribe(
        (response) => {
          this.categoriesDatasource.data = response.categories
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar las categorías"
          })
        }
      )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.categoriesDatasource.filter = filterValue.trim().toLowerCase();
  }

  add() {
    const dialogRef = this.addCategoryDialog.open(AddCategoryDialogComponent, { });

    dialogRef.afterClosed()
      .subscribe(
        (result: Category[]) => {
          if(result && result.length > 0) {
            this.categoriesDatasource.data.forEach(
              (category: Category) => {
                result.push(category)
              }
            )
            this.categoriesDatasource.data = result
          }
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
