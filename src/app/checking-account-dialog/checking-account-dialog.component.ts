import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CheckingAccountRequest, CheckingAccountResponse, ClientService } from '../service/client.service';
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
    private matDialogRef: MatDialogRef<CheckingAccountDialogComponent>,
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

  createCheckingAccount(){

    var reg = /^\d+$/;  

    if (this.limitControl.value < 0 || !reg.test(this.limitControl.value)){
      this.limitControl.setErrors({"zero": true});
      this.getErrors();
    }else{

      let request: CheckingAccountRequest = {
        client_id: this.data.client_id,
        credit_limit: this.limitControl.value
      }
    
      this.clientService.createCheckingAccount(request)
        .subscribe(
          (response) => {
            if(response == null) {
              console.log("No se creo la cuenta")
            } else {
              Swal.fire({
                icon:"success",
                title: "¡Cuenta Corriente creada!",
              })
              this.clientCheckingAccount = response;
            }
          },
          (error) => {
            Swal.fire({
              icon:"error",
              title: "¡No se pudo crear la cuenta!",
            })
          }
        );
    }
  }

  updateCreditLimit(){

    if(this.validateLimit()){
 
      let request: CheckingAccountRequest = {
        client_id: this.data.client_id,
        credit_limit: this.limitControl.value
      }
      this.clientService.updateCreditLimit(request)
        .subscribe(
          (response) => {
            if(response == false) {
              this.limitControl.setErrors({"others": true});
              this.getErrors();
              Swal.fire({
                icon:"error",
                title: "¡No se pudo actualizar el límite de crédito!",
              })
            } else {
              Swal.fire({
                icon:"success",
                title: "¡Límite de Crédito Actualizado!",
              })
              this.getCheckingAccount(this.data.client_id)
            }
          },
          (error) => {
            Swal.fire({
              icon:"error",
              title: "¡No se pudo actualizar el límite de crédito!",
            })
            
          }
        );
      }
  } 
  validateLimit(){

    var reg = /^\d+$/;

    if (this.limitControl.value < 0 ||  !reg.test(this.limitControl.value)){
      this.limitControl.setErrors({"zero": true});
      this.getErrors();
      return false
    }else if (this.limitControl.value < this.clientCheckingAccount.balance_due){
      this.limitControl.setErrors({"invalid": true});
      this.getErrors();
      return false
    }else{
      return true
    }
  }

  getErrors() {
    if (this.limitControl.hasError("invalid")) {
      return "El límite de crédito debe ser mayor o igual al saldo adeudado";
    } else if (this.limitControl.hasError("others")){
      return "No se pudo actualizar el límite de crédito";
    } else if (this.limitControl.hasError("zero")){
      return "El límite de crédito debe ser mayor o igual a 0 y/o sólo puede tener caracteres numéricos";
    }
  }

  isAllowed() {
    return this.roleService.isSupervisor() || this.roleService.isManager()
  }

  close() {
    this.matDialogRef.close()
  }


}

export interface CheckingAccountData {
  client_id: number;
  client_name: string;

}
