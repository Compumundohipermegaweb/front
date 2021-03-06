import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CashService } from '../service/cash.service';
import { cashMovementRequest, cashMovementResponse } from '../service/cash.service';
import { CashSummaryComponent } from '../cash-summary/cash-summary.component';

@Component({
  providers: [CashSummaryComponent],
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
    public dialogRef: MatDialogRef<AddExpenseDialogComponent>,
    public cashSummary: CashSummaryComponent
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
      cash_start_end_id: this.cashService.getCurrentCash(),
      movement_type: "EGRESO",
      source_id: 6,
      source_description: this.sourceControl.value,
      user_id: 1,
      amount: this.amountControl.value,
      detail: this.descriptionControl.value
    }

    if(!this.isValid()) {
      return;
    }
    
    if(this.cashSummary.getTotalCost() < this.amountControl.value){
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No hay suficiente dinero en caja para el egreso"
      })
      return;
    }
    

    this.cashService.registerCash(expense)
      .subscribe(
        (response) => {
          Swal.fire({
            icon:"success",
            title: "??Egreso creado!"
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

