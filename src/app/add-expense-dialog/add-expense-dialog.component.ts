import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CashExpenseComponent, CashMovementExpense } from '../cash-expense/cash-expense.component';
import { CashService } from '../service/cash.service';
import { cashMovementRequest, cashMovementResponse } from '../service/cash.service';

@Component({
  selector: 'app-add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.css']
})
export class AddExpenseDialogComponent implements OnInit {

  expensesCreated: cashMovementResponse[]

  sourceControl: FormControl
  descriptionControl: FormControl
  amountControl: FormControl

  expenseForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private cashService: CashService,
    public dialogRef: MatDialogRef<AddExpenseDialogComponent>
  ) { 
    this.sourceControl = new FormControl()
    this.descriptionControl = new FormControl()
    this.amountControl = new FormControl()

    this.expenseForm = formBuilder.group({
      source:  this.sourceControl,
      description: this.descriptionControl,
      amount: this.amountControl
    })

    this.dialogRef.disableClose = true
    this.expensesCreated = []
  }

  ngOnInit(): void {
  }

  create(){
    let expense = {
      cash_start_end_id: 1,
      movement_type: "EGRESO",
      source_id: 6,
      source_description: this.descriptionControl.value,
      user_id: 1,
      amount: this.amountControl.value,
      detail: this.sourceControl.value
    }

    if(!this.isValid()) {
      return;
    }

    this.cashService.registerCash(expense)
      .subscribe(
        (response) => {
          Swal.fire({
            icon:"success",
            title: "¡Egreso creado!"
          })

          this.expensesCreated.push(response)
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
    return this.expenseForm.valid
  }

  close(){
    this.dialogRef.close(this.expensesCreated)
  }

}

