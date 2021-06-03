import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  nameControl: FormControl
  descriptionControl: FormControl

  categoriesDatasource: MatTableDataSource<Category>
  displayedColumns: String[]

  constructor(private addCategoryDialog: MatDialog, private categoryService: CategoryService, public changeDetectorRef: ChangeDetectorRef) {
    this.nameControl = new FormControl()
    this.descriptionControl = new FormControl()
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

  delete(category: Category) {
    
    Swal.fire({
      icon: "question",
      title: "Seguro desea eliminar",
      text: category.name.toString(),
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#3f51b5",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#f44336"
    }).then((result) => {
      if(result.isConfirmed) {
        this.categoryService.delete(category.id)
          .subscribe(
            (response) => {
              Swal.fire({
                icon: "success",
                title: "Item eliminado!",
                text: "Se ha eliminado " + category.name
              });

              this.categoriesDatasource.data = this.categoriesDatasource.data.filter((it) => it.id != category.id);
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

  toggleEdit(category: Category) {
    category.editing = !category.editing
  }

  saveChanges(category: Category) {
    debugger;
    let changes = {
      name: this.nameControl.value,
      description: this.descriptionControl.value
    }

    if(changes.name == null && changes.description == null) {
      return;
    }

    if(changes.name) {
      category.name = changes.name
    }

    if(changes.description) {
      category.description = changes.description
    }

    this.categoryService.save(category)
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: "¡Cambios guardados!"
          })
          this.nameControl.setValue(null)
          this.descriptionControl.setValue(null)
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron guardar los cambios"
          })
        }
      )
  }

}

export interface Category {
  id: number;
  name: String;
  description: String;
  editing?: boolean;
}
