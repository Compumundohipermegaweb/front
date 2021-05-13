import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client } from '../sales/sales.model';

@Component({
  selector: 'app-client-lookup-dialog',
  templateUrl: './client-lookup-dialog.component.html',
  styleUrls: ['./client-lookup-dialog.component.css']
})
export class ClientLookupDialogComponent implements OnInit { 

  form: FormGroup;
  nameControl: FormControl;
  documentControl: FormControl;

  foundClients: Client[] = []
  selectedClient: Client;

  constructor(
    public dialogRef: MatDialogRef<ClientLookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClientLookupDialogData,
    private formBuilder: FormBuilder
  ) { 
    this.nameControl = new FormControl("")
    this.documentControl = new FormControl("")

    this.form = formBuilder.group({
      name: this.nameControl,
      document: this.documentControl
    });
  }

  ngOnInit() {

  }

  lookupClients() {
    this.foundClients = [
      { firstName: "Damian", lastName: "Lisas", document: "40060441" },
      { firstName: "Damian", lastName: "Lisas", document: "40060441" },
      { firstName: "Damian", lastName: "Lisas", document: "40060441" }
    ]
  }

  selectClient(client: Client) {
    this.dialogRef.close(client)
  }

}

export interface ClientLookupDialogData {
  document: number
}
