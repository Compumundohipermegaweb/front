import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Category } from '../categories/categories.component';
import { CategoryService } from '../service/category/category.service';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.css']
})
export class AddCategoryDialogComponent implements OnInit {

  categoriesCreated: Category[]

  nameControl: FormControl
  descriptionControl: FormControl

  categoryForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>
  ) { 

    this.nameControl = new FormControl()
    this.descriptionControl = new FormControl()

    this.categoryForm = formBuilder.group({
      name:  this.nameControl,
      description: this.descriptionControl
    })

    this.dialogRef.disableClose = true
    this.categoriesCreated = []
  }

  ngOnInit(): void {
  }

  create() {
    let category = {
      name: this.nameControl.value,
      description: this.descriptionControl.value
    }

    if(!this.isValid(category)) {
      return;
    }

    this.categoryService.create(category)
      .subscribe(
        (response) => {
          Swal.fire({
            icon:"success",
            title: "¡Categoría creada!",
            text: "Categoria " + response.name + " creada con éxito"
          })

          this.categoriesCreated.push(response)
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

  isValid(category) {
    return this.categoryForm.valid
  }

  close() {
    this.dialogRef.close(this.categoriesCreated)
  }
}
