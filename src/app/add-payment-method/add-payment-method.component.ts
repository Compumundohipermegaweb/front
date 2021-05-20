import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.css']
})
export class AddPaymentMethodComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddPaymentMethodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentMethodDialogData,
    private formBuilder: FormBuilder) {
      this.form = formBuilder.group({

      })
    }

  ngOnInit(): void {
  }

  addNewPaymentMethod(){

  }
}



export interface PaymentMethodDialogData {

}
