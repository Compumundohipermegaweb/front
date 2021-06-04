import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MeasurementUnit } from '../measurement-units/measurement-units.component';
import { UnitService } from '../service/unit.service';

@Component({
  selector: 'app-add-unit-dialog',
  templateUrl: './add-unit-dialog.component.html',
  styleUrls: ['./add-unit-dialog.component.css']
})
export class AddUnitDialogComponent implements OnInit {

  unitsCreated: MeasurementUnit[]

  nameControl: FormControl
  descriptionControl: FormControl

  unitForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private unitService: UnitService,
    public dialogRef: MatDialogRef<AddUnitDialogComponent>
  ) {

    this.nameControl = new FormControl()
    this.descriptionControl = new FormControl()

    this.unitForm = formBuilder.group({
      name:  this.nameControl,
      description: this.descriptionControl
    })

    this.dialogRef.disableClose = true
    this.unitsCreated = []
  }

  ngOnInit(): void {
  }

  create() {
    let unit = {
      name: this.nameControl.value,
      description: this.descriptionControl.value
    }

    if(!this.isValid(unit)) {
      return;
    }

    this.unitService.create(unit)
      .subscribe(
        (response) => {
          Swal.fire({
            icon:"success",
            title: "¡Unidad de Medida creada!",
            text: "Unidad " + response.name + " creada con éxito"
          })

          this.unitsCreated.push(response)
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo crear la unidad de medida"
          })
        }
      )
  }

  isValid(unit) {
    return this.unitForm.valid
  }

  close() {
    this.dialogRef.close(this.unitsCreated)
  }
}
