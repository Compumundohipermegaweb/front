import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import Swal  from 'sweetalert2';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements OnInit, AfterViewInit {

  EXAMPLE_DATA: MyTableClients[] =[
    {id: 1, name: "maxi", email: 'jorge@yahoo.com', credit_limit: 2000, defaulter: false, state: true}
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MyTableClients>;
  dataSource = new MatTableDataSource<MyTableClients>();

  displayedColumns = ['id', 'nombre', 'email', 'limite', 'moroso', 'estado', 'acciones'];

  constructor(private changeDetectorRefs: ChangeDetectorRef) {
    this.dataSource.data = this.EXAMPLE_DATA;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  delete(row: MyTableClients){
    Swal.fire({
      icon: "question",
      title: "Seguro desea eliminar",
      text: "Cliente" + row.name,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#3f51b5",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#f44336"
    }).then((result) => {
      if(result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Item eliminado!",
          text: "Se ha eliminado " + "Cliente" + row.name
        });
        this.EXAMPLE_DATA = this.EXAMPLE_DATA.filter((cli: MyTableClients) => cli.id != row.id)
        this.refreshDataSource()
      }
    })
  }

  private refreshDataSource() {
    this.dataSource.data = this.EXAMPLE_DATA;
  }
}

export interface MyTableClients{
  id: number;
  name: String;
  email: String;
  credit_limit: number;
  defaulter: boolean;
  state: boolean;
}
