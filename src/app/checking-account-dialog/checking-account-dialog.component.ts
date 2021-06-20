import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckingAccountResponse, ClientService } from '../service/client.service';
import { RoleService } from '../service/role.service';

@Component({
  selector: 'app-checking-account',
  templateUrl: './checking-account-dialog.component.html',
  styleUrls: ['./checking-account-dialog.component.css']
})
export class CheckingAccountDialogComponent implements OnInit {

  clientControl = ""
  accountControl = 0
  limitControl: FormControl
  balanceDueControl = 0.00
  balanceControl = 0.00
  
  checkingAccountForm: FormGroup
  clientCheckingAccount: CheckingAccountResponse = {
    id: null,
    balance: null,
    balance_due: null,
    credit_limit: null
  }  

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public data: CheckingAccountData
  ){

    this.getCheckingAccount(data.client_id)
    this.limitControl = new FormControl()
    this.limitControl.setValue(this.clientCheckingAccount.credit_limit)
    this.clientControl = data.client_name


    this.checkingAccountForm = this.formBuilder.group({
      
    })

  }

  ngOnInit(): void {
  }

  getCheckingAccount(client : number){

    this.clientService.getClientBalance(client)
          .subscribe(
            (response) => {
             console.log(JSON.stringify(response))
              if(response == null) {
                console.log("sin cuenta")
              } else {
                this.clientCheckingAccount = response;
              }
            },
            (error) => {
              console.log("Error al traer cuenta")
            }
          );
  }

  isAllowed() {
    return this.roleService.isSupervisor() || this.roleService.isManager()
  }


}

export interface CheckingAccountData {
  client_id: number;
  client_name: string;

}
