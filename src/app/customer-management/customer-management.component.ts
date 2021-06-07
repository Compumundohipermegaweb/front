import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { runInThisContext } from 'node:vm';
import Swal  from 'sweetalert2';
import { ClientService } from '../service/client.service'

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements OnInit, AfterViewInit {



  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MyTableClients>;
  dataSource = new MatTableDataSource<Client>();

  displayedColumns = ['id', 'nombre', 'email', 'limite', 'moroso', 'estado', 'acciones'];

  constructor(private changeDetectorRefs: ChangeDetectorRef, private clientService: ClientService) {
    this.initDataSource();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  initDataSource(){
    this.dataSource = new MatTableDataSource();

    this.clientService.getClient()
      .subscribe(
        (response) => {
          this.dataSource.data = response.clients
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar las categorías"
          })
        }
      )
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
        //this.EXAMPLE_DATA = this.EXAMPLE_DATA.filter((cli: MyTableClients) => cli.id != row.id)
        //this.refreshDataSource()
      }
    })
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

export interface Client{
  id: number;
  document_number: String;
  first_name: String;
  last_name: String;
  state: String;
  credit_limit: number;
  email: String;
  contact_number: String;
}
