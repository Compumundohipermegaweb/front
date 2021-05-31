import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MeasurementUnitsComponent, Unit } from '../measurement-units/measurement-units.component';
import { UnitService } from '../service/unit.service';

@Component({
  selector: 'app-add-unit-dialog',
  templateUrl: './add-unit-dialog.component.html',
  styleUrls: ['./add-unit-dialog.component.css']
})
export class AddUnitDialogComponent implements OnInit {

  unitsCreated: Unit[]

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

  }

  isValid(unit) {
    return this.unitForm.valid
  }

  close() {
    this.dialogRef.close(this.unitsCreated)
  }
}
