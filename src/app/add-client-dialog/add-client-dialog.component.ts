import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ClientResponse, ClientService } from '../service/client.service';

@Component({
  selector: 'app-add-client-dialog',
  templateUrl: './add-client-dialog.component.html',
  styleUrls: ['./add-client-dialog.component.css']
})
export class AddClientDialogComponent implements OnInit {

  clientForm: FormGroup;
  creatingClient = false;

  documentControl: FormControl;
  firstNameControl: FormControl;
  lastNameControl: FormControl;
  stateControl: FormControl;
  creditLimitControl: FormControl;
  emailControl: FormControl;
  contactNumberControl: FormControl;
  addressControl: FormControl;

  createdClients: ClientResponse[];

  clients: ClientResponse[];

  repetido: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddClientDialogComponent>, 
    private formBuilder: FormBuilder,
    private clientService: ClientService) 
    {
      this.createdClients = []

      this.documentControl = new FormControl()
      this.firstNameControl = new FormControl()
      this.lastNameControl = new FormControl()
      this.emailControl = new FormControl()
      this.contactNumberControl = new FormControl()
      this.addressControl = new FormControl()
      this.stateControl = new FormControl()
      this.creditLimitControl = new FormControl()

      this.clientForm = formBuilder.group({
        document: this.documentControl,
        first_name: this.firstNameControl,
        last_name: this.lastNameControl,
        email: this.emailControl,
        contactNumber: this.contactNumberControl,
        address: this.addressControl,
        state: this.stateControl,
        credit_limit: this.creditLimitControl
      })

      this.dialogRef.disableClose = true;

      this.fetchClients()

      this.repetido = false;
    }

  ngOnInit(): void {
  }

  fetchClients(){
    this.clients = []

    this.clientService.getAll()
      .subscribe(
        (response) => {
          this.clients = response.clients.filter((it)=>it.id!=0)
        }
      )
  }


  createClient(){
    this.creatingClient = true;

    if(this.clientForm.invalid) {
      this.creatingClient = false;
      return;
    }

    let client: Client = {
      document_number: this.documentControl.value,
      first_name: this.firstNameControl.value,
      last_name: this.lastNameControl.value,
      email: this.emailControl.value,
      contact_number: this.contactNumberControl.value,
      address: this.addressControl.value,
      credit_limit: this.creditLimitControl.value,
      state: this.getState(),
      }

    this.clientService.newClient(client)
      .subscribe(
        (response) => {
          this.creatingClient = false;
          Swal.fire({
            icon: "success",
            title: "¡Cliente creado!"
          });

          this.createdClients.push(response);
          console.log("Clientes creados = " + this.createdClients.length)
          this.close()
        },

        (error) => {
          this.creatingClient = false;
          Swal.fire({
            icon: "error",
            title: "Fallo al crear el nuevo Cliente",
            text: "No se pudo crear el cliente, revise los campos y vuelva a intentar. Si el error persiste contacte un administrador"
          });
        }
      );
  }

  validateClient(){
    this.repetido = false;
    this.clients.forEach(element => {
      if(element.document_number == this.documentControl.value){
        this.repetido = true;
        this.documentControl.setErrors({"invalid": true});
      }
    });
    if(this.repetido == false){
      this.documentControl.setErrors(null)
    }
    
  }

  getDocumentErrors() {
    if(this.documentControl.hasError("invalid")) {
      return " Documento Existente ";
    }
  }

  private getState() {
    if(this.stateControl.value) {
      return "ACTIVO";
    } else {
      return "INACTIVO";
    }
  }

  close() {
    this.dialogRef.close(this.createdClients)
  }

}

export interface Client{
  id?: number;
  document_number: String;
  first_name: String;
  last_name: String;
  state: String;
  credit_limit: number;
  email: String;
  contact_number: String;
  address: String
  editing?: boolean;
}