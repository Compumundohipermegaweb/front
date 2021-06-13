import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CashIncomeComponent } from '../cash-income/cash-income.component';
import { CashService } from '../service/cash.service';


@Component({
  selector: 'app-add-income-dialog',
  templateUrl: './add-income-dialog.component.html',
  styleUrls: ['./add-income-dialog.component.css']
})
export class AddIncomeDialogComponent implements OnInit {

  incomesCreated: CashIncomeComponent[]

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
    
  }

  isValid(){
    return this.incomeForm.valid
  }

  close(){
    this.dialogRef.close(this.incomesCreated)
  }

}



