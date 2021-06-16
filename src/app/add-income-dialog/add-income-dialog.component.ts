import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CashService } from '../service/cash.service';


@Component({
  selector: 'app-add-income-dialog',
  templateUrl: './add-income-dialog.component.html',
  styleUrls: ['./add-income-dialog.component.css']
})
export class AddIncomeDialogComponent implements OnInit {

  incomesCreated: cashMovementResponse[]

  sourceControl: FormControl
  descriptionControl: FormControl
  amountControl: FormControl

  incomeForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private cashService: CashService,
    public dialogRef: MatDialogRef<AddIncomeDialogComponent>
  ) { 
    this.sourceControl = new FormControl()
    this.descriptionControl = new FormControl()
    this.amountControl = new FormControl()

    this.incomeForm = formBuilder.group({
      source:  this.sourceControl,
      description: this.descriptionControl,
      amount: this.amountControl
    })

    this.dialogRef.disableClose = true
    this.incomesCreated = []
  }

  ngOnInit(): void {
  }

  create(){
    let expense = {
      cash_start_end_id: this.cashService.getCurrentCash(),
      movement_type: "INGRESO",
      source_id: 5,
      source_description: this.sourceControl.value,
      user_id: 1,
      amount: this.amountControl.value,
      detail: this.descriptionControl.value
    }

    if(!this.isValid()) {
      return;
    }

    this.cashService.registerCash(expense)
      .subscribe(
        (response) => {
          Swal.fire({
            icon:"success",
            title: "¡Ingreso creado!"
          })

          this.incomesCreated.push(response)
          this.close()
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo crear el nuevo egreso"
          })
        }
      )
  }

  isValid(){
    return this.incomeForm.valid
  }

  close(){
    this.dialogRef.close(this.incomesCreated)
  }

}

export interface cashMovementResponse{
  id: number;
  cash_start_end_id: number;
  movement_type: String;
  source_id: number;
  source_description: String;
  user_id: number;
  amount: number;
  detail: String
}


