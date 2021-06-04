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

  measurementUnitsDatasource: MatTableDataSource<MeasurementUnit>
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
    this.measurementUnitsDatasource = new MatTableDataSource()

    this.unitService.findAll()
      .subscribe(
        (response) => {
          this.measurementUnitsDatasource.data = response.units
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar las unidades de medida"
          })
        }
      )
  }

  add() {
    const dialogRef = this.addUnitDialog.open(AddUnitDialogComponent, { });

    dialogRef.afterClosed()
      .subscribe(
        (result: MeasurementUnit[]) => {
          if(result && result.length > 0) {
            this.measurementUnitsDatasource.data.forEach(
              (unit: MeasurementUnit) => {
                result.push(unit)
              }
            )
            this.measurementUnitsDatasource.data = result
          }
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.measurementUnitsDatasource.filter = filterValue.trim().toLowerCase();
  }

  delete(unit: MeasurementUnit) {

    Swal.fire({
      icon: "question",
      title: "Seguro desea eliminar",
      text: unit.name.toString(),
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#3f51b5",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#f44336"
    }).then((result) => {
      if(result.isConfirmed) {
        this.unitService.delete(unit.id)
          .subscribe(
            (response) => {
              Swal.fire({
                icon: "success",
                title: "Item eliminado!",
                text: "Se ha eliminado " + unit.name
              });

              this.measurementUnitsDatasource.data = this.measurementUnitsDatasource.data.filter((it) => it.id != unit.id);
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

  toggleEdit(unit: MeasurementUnit) {
    unit.editing = !unit.editing
  }

  saveChanges(unit: MeasurementUnit) {
    debugger;
    let changes = {
      name: this.nameControl.value,
      description: this.descriptionControl.value
    }

    if(changes.name == null && changes.description == null) {
      return;
    }

    if(changes.name) {
      unit.name = changes.name
    }

    if(changes.description) {
      unit.description = changes.description
    }

    this.unitService.save(unit)
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

export interface MeasurementUnit {
  id: number;
  name: String;
  description: String;
  editing?: boolean;
}
