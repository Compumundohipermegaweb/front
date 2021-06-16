import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from '../service/settings.service'
import Swal from 'sweetalert2';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {

  timeControl: FormControl;

  dataSource: MatTableDataSource<Alert>;

  displayedColums: String[]

  constructor(private editScheduleDialog: MatDialog, public changeDetectorRef: ChangeDetectorRef, private settingService: SettingsService) {
    this.timeControl = new FormControl();
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

    if(!this.isValid()){
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El valor debe estar entre 1 y 24"
      })
      return
    }

    let changes = {
      time: this.timeControl.value,
    }

    if(changes.time == null) {
      return;
    }

    if(changes.time) {
      alerta.time = changes.time
    }

    this.settingService.updateAlert(alerta)
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: "¡Cambios guardados!"
          })
          this.timeControl.setValue(null)
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

  isValid(): boolean{
    this.timeControl.setValue(Math.trunc(Number(this.timeControl.value)))
    if(this.timeControl.value > 0 && this.timeControl.value < 25){
      return true;
    }else{
      return false;
    }
  }

}

/*
  var x = "32";
  var y: number = +x;
*/



export interface Alert{
  id: number;
  time: String;
  alert_description: String;
  editing?: boolean;
}
