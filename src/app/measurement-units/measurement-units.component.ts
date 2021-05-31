import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AddUnitDialogComponent } from '../add-unit-dialog/add-unit-dialog.component';
import { UnitService } from '../service/unit.service';

@Component({
  selector: 'app-measurement-units',
  templateUrl: './measurement-units.component.html',
  styleUrls: ['./measurement-units.component.css']
})
export class MeasurementUnitsComponent implements OnInit {

  nameControl: FormControl
  descriptionControl: FormControl

  measurementUnitsDatasource: MatTableDataSource<Unit>
  displayedColumns: String[]

  constructor(public changeDetectorRef: ChangeDetectorRef, private addUnitDialog: MatDialog, private unitService: UnitService,) {
    this.nameControl = new FormControl()
    this.descriptionControl = new FormControl()
    this.initDataSource()
    this.displayedColumns = ["name", "description", "actions"]
  }

  ngOnInit(): void {
  }

  initDataSource() {

  }

  add(){
    const dialogRef = this.addUnitDialog.open(AddUnitDialogComponent, { });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.measurementUnitsDatasource.filter = filterValue.trim().toLowerCase();
  }
}

export interface Unit {
  id: number;
  name: String;
  description: String;
  editing?: boolean;
}
