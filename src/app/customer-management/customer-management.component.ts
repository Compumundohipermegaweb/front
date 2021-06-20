import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import Swal  from 'sweetalert2';
import { CheckingAccountDialogComponent } from '../checking-account-dialog/checking-account-dialog.component';
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

  displayedColumns = ['id', 'document','name','email','contactNumber' ,'estado', 'acciones'];

  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private clientService: ClientService,
    private checkingAccountDialog: MatDialog)
  {
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

    this.clientService.getAll()
      .subscribe(
        (response) => {
          this.dataSource.data = response.clients.filter((it)=>it.id!=0)
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
  updateCheckingAccount(client : Client) {

    const dialogRef = this.checkingAccountDialog.open(CheckingAccountDialogComponent,
         { data: {client_id: client.id,
                  client_name: client.first_name +" "+client.last_name }})
    let ok 
    dialogRef.afterClosed()
    .subscribe(
      (result: Client) => {
        if(result) {
          ok = result
        }
      },

      (error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo guardar los cambios"
        })
      }
    )
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
