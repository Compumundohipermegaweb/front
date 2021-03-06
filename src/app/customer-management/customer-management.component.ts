import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import Swal  from 'sweetalert2';
import { AddClientDialogComponent } from '../add-client-dialog/add-client-dialog.component';
import { CheckingAccountDialogComponent } from '../checking-account-dialog/checking-account-dialog.component';
import { ClientResponse, ClientService } from '../service/client.service'

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']
})
export class CustomerManagementComponent implements OnInit{

  stateControl: FormControl;
  contactNumberControl: FormControl;
  emailControl: FormControl;
  nroDocumentControl: FormControl;
  firstNameControl: FormControl;
  lastNameControl: FormControl;

 
  dataSource = new MatTableDataSource<Client>();

  displayedColumns = ['id', 'documento', 'nombre', 'apellido' ,'email','telefono' ,'estado', 'acciones'];

  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private clientService: ClientService,
    private checkingAccountDialog: MatDialog,
    private newClient: MatDialog)
  {
    this.initDataSource();
    this.stateControl = new FormControl()
    this.contactNumberControl = new FormControl()
    this.emailControl = new FormControl()
    this.nroDocumentControl = new FormControl();
    this.firstNameControl = new FormControl();
    this.lastNameControl = new FormControl();
  }

  ngOnInit(): void {
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
            text: "No se pudieron cargar las categor??as"
          })
        }
      )
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  delete(row: Client){
    Swal.fire({
      icon: "question",
      title: "Seguro desea eliminar",
      text: "Cliente" + row.first_name + row.last_name,
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
          text: "Se ha eliminado " + "Cliente" + row.first_name + row.last_name
        });
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

 toggleEdit(client: Client){
  client.editing = !client.editing
 }

 saveChanges(client: Client){
  debugger;
    let changes = {
      email: this.emailControl.value,
      contact_number: this.contactNumberControl.value,
      state: this.stateControl.value,
      first_name: this.firstNameControl.value,
      document_number: this.nroDocumentControl.value,
      last_name: this.lastNameControl.value,
      address: ""
    }

    if(changes.email == null && changes.contact_number == null && changes.state == null && changes.first_name == null && changes.document_number == null  && changes.last_name == null){
      alert("entro")
      return;
    }

    if(changes.email) {
      client.email = changes.email
    }

    if(changes.first_name) {
      client.first_name = changes.first_name
    }

    if(changes.last_name) {
      client.last_name = changes.last_name
    }

    if(changes.contact_number) {
      client.contact_number = changes.contact_number
    }

    if(changes.state) {
      client.state = changes.state
    }

    if(changes.document_number) {
      client.document_number = changes.document_number
    }


    

    this.clientService.save(client)
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: "??Cambios guardados!"
          })
          this.stateControl.setValue(null)
          this.contactNumberControl.setValue(null)
          this.emailControl.setValue(null)
          this.nroDocumentControl.setValue(null)
          this.firstNameControl.setValue(null)
          this.lastNameControl.setValue(null)
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

  add(){
    const dialogRef = this.newClient.open(AddClientDialogComponent, { });

    dialogRef.afterClosed()
      .subscribe(
        (result: ClientResponse[]) => {
          if(result != null && result.length > 0) {
            result.forEach(element => {
              this.dataSource.data.push(element);
            });
            this.changeDetectorRefs.detectChanges();
          }
        }
      );
  }
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
  address?: String
  editing?: boolean;
}

