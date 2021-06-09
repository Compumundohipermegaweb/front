import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit, AfterViewInit {

  EXAMPLE_DATA: TableSetting[] = [
    {id: 1, descripcion: "Nose", horario: 18}
  ]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TableSetting>;

  dataSource = new MatTableDataSource();

  displayedColumns = ['id', 'descripcion', 'horario'];

  constructor() {
    this.dataSource.data = this.EXAMPLE_DATA;
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  cambioHorario(setting: TableSetting){
    alert(document.getElementById("horario").innerHTML.valueOf());
  }

}

export interface TableSetting{
  id: number;
  descripcion: String;
  horario: number;
}
