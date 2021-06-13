import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CashExpenseComponent } from '../cash-expense/cash-expense.component';
import { CashService } from '../service/cash.service';

@Component({
  selector: 'app-add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.css']
})
export class AddExpenseDialogComponent implements OnInit {

  expensesCreated: CashExpenseComponent[]

  supplierControl: FormControl
  descriptionControl: FormControl
  amountControl: FormControl

  expenseForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private cashService: CashService,
    public dialogRef: MatDialogRef<AddExpenseDialogComponent>
  ) { 
    this.supplierControl = new FormControl()
    this.descriptionControl = new FormControl()
    this.amountControl = new FormControl()

    this.expenseForm = formBuilder.group({
      supplier:  this.supplierControl,
      description: this.descriptionControl,
      amount: this.amountControl
    })

    this.dialogRef.disableClose = true
    this.expensesCreated = []
  }

  ngOnInit(): void {
  }

  create(){
    
  }

  isValid(){
    return this.expenseForm.valid
  }

  close(){
    this.dialogRef.close(this.expensesCreated)
  }

}
