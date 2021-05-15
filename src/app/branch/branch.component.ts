
import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']

})

//export class BranchComponent implements AfterViewInit {
export class BranchComponent implements OnInit, AfterViewInit{
    EXAMPLE_DATA: MyTableItem[] = [
    {codigo_sucursal: 1, domicilio: 'Av. Siempreviva 742', codigo_postal: '1696', horarios: '15 a 20', telefono: '02320455482', mail: ''},
    {codigo_sucursal: 2, domicilio: 'Av. Lamas 44', codigo_postal: '1665', horarios: '08 a 20', telefono: '02320455481', mail: ''},
    {codigo_sucursal: 3, domicilio: 'Av. Rogerio Funes Mori 258', codigo_postal: '1741', horarios: '15 a 20', telefono: '02320455484', mail: ''},
    {codigo_sucursal: 4, domicilio: 'Av. Cabildo 1351', codigo_postal: '1892', horarios: '10 a 22', telefono: '02320455483', mail: ''},
    {codigo_sucursal: 5, domicilio: 'Av. Rivadavia 8798', codigo_postal: '1582', horarios: '19 a 20', telefono: '02320455485', mail: ''},

  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MyTableItem>;
  dataSource = new MatTableDataSource<MyTableItem>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['codigo', 'domicilio', 'cp', 'horarios', 'telefono', 'mail'];

  constructor(private changeDetectorRefs: ChangeDetectorRef) {
    this.dataSource.data = this.EXAMPLE_DATA;
  }

  ngOnInit(): void {

  }



  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}

export interface MyTableItem {
  telefono: string
  mail: string
  horarios: string
  codigo_postal: string
  domicilio: string
  codigo_sucursal: number;

}


