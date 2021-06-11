import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormControl} from '@angular/forms';
import { EditScheduleDialogComponent } from '../edit-schedule-dialog/edit-schedule-dialog.component'
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from '../service/settings.service'
import Swal from 'sweetalert2';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  hControl: FormControl;

  EXAMPLE_DATA: Alert[] = [
    {id: 1, processDescription: "Nose", time: "18", editing: true}
  ]



  dataSource: MatTableDataSource<Alert>;


  displayedColums: String[]


  constructor(private editScheduleDialog: MatDialog, public changeDetectorRef: ChangeDetectorRef, private settingService: SettingsService) {
    //this.dataSource.data = this.EXAMPLE_DATA;
    this.hControl = new FormControl();
    this.initDataSource()
    this.displayedColums = ["id", "descripcion", "horario", "acciones"]
   }

  ngOnInit(): void {
  }

  initDataSource() {
    this.dataSource = new MatTableDataSource()

    this.settingService.getAllAlerts()
      .subscribe(
        (response) => {
          this.dataSource.data = response.alerts
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar las Alertas"
          })
        }
      )
  }

  toggleEdit(alerta: Alert) {
    alerta.editing = !alerta.editing
  }

  saveChanges(alerta: Alert) {
    debugger;
    let changes = {
      time: this.hControl.value,
    }

    if(changes.time == null) {
      return;
    }

    if(changes.time) {
      alerta.time = changes.time
    }

    /*this.settingService.save(category)
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
  }*/

}
}


export interface Alert{
  id: number;
  time: String;
  processDescription: String;
  editing?: boolean;
}
