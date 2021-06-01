import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { PaymentMethod, PaymentMethodType } from '../payment-methods/payment-methods.component';
import { PaymentMethodService } from '../service/payment-method.service';

@Component({
  selector: 'app-new-payment-method',
  templateUrl: './new-payment-method.component.html',
  styleUrls: ['./new-payment-method.component.css']
})
export class NewPaymentMethodComponent implements OnInit {

  paymentMethodForm: FormGroup

  descriptionControl: FormControl
  typeControl: FormControl
  stateControl: FormControl

  paymentMethodTypes: PaymentMethodType[] = []

  createdPaymentMethods: PaymentMethod[] = []

  constructor(
    private formBuilder: FormBuilder,
    private paymentMethodService: PaymentMethodService,
    private matDialogRef: MatDialogRef<NewPaymentMethodComponent>
  ) {
    this.descriptionControl = new FormControl()
    this.typeControl = new FormControl()
    this.stateControl = new FormControl()

    this.paymentMethodForm = formBuilder.group({
      description: this.descriptionControl,
      type: this.typeControl,
      state: this.stateControl
    })

    this.initPaymentMethodTypes()
  }

  ngOnInit(): void {
  }

  initPaymentMethodTypes() {
    this.paymentMethodService.getAllTypes()
      .subscribe(
        (response) => {
          this.paymentMethodTypes = response.types
        }
      )
  }

  create() {
    let paymentMethod = {
      payment_method: this.descriptionControl.value,
      type: this.typeControl.value,
      state: this.getState()
    }


    if(this.paymentMethodForm.invalid) {
      return;
    }

    this.paymentMethodService.create(paymentMethod)
      .subscribe(
        (response) => {
          Swal.fire({
            icon:"success",
            title: "¡Categoría creada!",
            text: "Categoria " + response.description + " creada con éxito"
          })

          this.createdPaymentMethods.push(response)
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo crear la categoria"
          })
        }
      )
  }

  getState(): String {
    if(this.stateControl.value) {
      return "ACTIVE"
    } else {
      return "INACTIVE"
    }
  }
  
  close() {
    this.matDialogRef.close(this.createdPaymentMethods)
  }

}
