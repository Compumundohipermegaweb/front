import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormControl} from '@angular/forms';
import { EditScheduleDialogComponent } from '../edit-schedule-dialog/edit-schedule-dialog.component'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit, AfterViewInit {

  hControl: FormControl;

  EXAMPLE_DATA: TableSetting[] = [
    {id: 1, descripcion: "Nose", horario: 18}
  ]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableSetting>;

  dataSource = new MatTableDataSource();



  displayedColumns = ['id', 'descripcion', 'horario', 'acciones'];

  constructor(private editScheduleDialog: MatDialog, public changeDetectorRef: ChangeDetectorRef) {
    this.dataSource.data = this.EXAMPLE_DATA;
    this.hControl = new FormControl();
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  cambioHorario(setting: TableSetting){
    const dialogRef = this.editScheduleDialog.open(EditScheduleDialogComponent, {});
    //tengo que tomar el hcontrol.value y pasarselo al service para que lo setee en la base,
    //y cuando cargue otra vez mi datasource ya estara el nuevo dato ya que se toma de la base
    //alert(this.hControl.value)
  }

}

export interface TableSetting{
  id: number;
  descripcion: String;
  horario: number;
}
