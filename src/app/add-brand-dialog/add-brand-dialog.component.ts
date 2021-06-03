import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Brand } from '../brands/brands.component';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-add-brand-dialog',
  templateUrl: './add-brand-dialog.component.html',
  styleUrls: ['./add-brand-dialog.component.css']
})
export class AddBrandDialogComponent implements OnInit {

  brandsCreated: Brand[]

  brandForm: FormGroup

  nameControl: FormControl

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private matDialogRef: MatDialogRef<AddBrandDialogComponent>
  ) { 
    this.matDialogRef.disableClose = true

    this.brandsCreated = []

    this.nameControl = new FormControl()

    this.brandForm = formBuilder.group({
      name: this.nameControl
    })
  }

  ngOnInit(): void {
  }

  create() {
    let brand = {
      name: this.nameControl.value
    }

    if(!this.isValid(brand)) {
      return;
    }

    this.brandService.create(brand)
      .subscribe(
        (response) => {
          Swal.fire({
            icon:"success",
            title: "¡Marca creada!",
            text: "Marca " + response.name + " creada con éxito"
          })

          this.brandsCreated.push(response)
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo crear la Marca"
          })
        }
      )
  }

  isValid(brand): Boolean {
    return true
  }

  close() {
    this.matDialogRef.close(this.brandsCreated)
  }
}
