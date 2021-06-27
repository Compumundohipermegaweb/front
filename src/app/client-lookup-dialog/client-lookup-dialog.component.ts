import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client } from '../sales/sales.model';
import { ClientResponse, ClientService } from '../service/client.service';

@Component({
  selector: 'app-client-lookup-dialog',
  templateUrl: './client-lookup-dialog.component.html',
  styleUrls: ['./client-lookup-dialog.component.css']
})
export class ClientLookupDialogComponent implements OnInit {

  searchingClients: boolean = false;


  form: FormGroup;
  nameControl: FormControl;
  lastNameControl: FormControl
  documentControl: FormControl;

  foundClients: Client[] = []
  selectedClient: Client;

  constructor(
    public dialogRef: MatDialogRef<ClientLookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClientLookupDialogData,
    private formBuilder: FormBuilder,
    private clientService: ClientService
  ) {
    this.nameControl = new FormControl("")
    this.lastNameControl = new FormControl("")
    this.documentControl = new FormControl("")

    this.form = formBuilder.group({
      name: this.nameControl,
      lastName: this.lastNameControl,
      document: this.documentControl
    });
  }

  ngOnInit() {

  }

  lookupClients() {
    this.searchingClients = true;
    this.clientService.getClientByFullParams(this.nameControl.value, this.lastNameControl.value, this.documentControl.value)
      .subscribe(
        (response) => {
          this.searchingClients = false;
          if(response) {
            this.foundClients =  response.map((it: ClientResponse) => this.toClient(it) )
          } else {
            this.foundClients = []
          }

        },
        (error) => {
          this.searchingClients = false;
        }
      );
  }

  selectClient(client: Client) {
    this.dialogRef.close(client)
  }

  private toClient(clientResponse: ClientResponse): Client {
    return {
      firstName: clientResponse.first_name,
      lastName: clientResponse.last_name,
      document: clientResponse.document_number,
      id: clientResponse.id
    }
  }

}

export interface ClientLookupDialogData {
  document: number
}
