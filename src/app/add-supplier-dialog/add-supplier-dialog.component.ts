import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { SupplierComponent } from '../supplier/supplier.component';
import { SupplierService } from '../service/supplier.service';

@Component({
  selector: 'app-add-supplier-dialog',
  templateUrl: './add-supplier-dialog.component.html',
  styleUrls: ['./add-supplier-dialog.component.css']
})
export class AddSupplierDialogComponent implements OnInit {

  suppliersCreated: Supplier[];

  nameControl: FormControl;
  organizationControl: FormControl;
  contactNumberControl: FormControl;
  emailControl: FormControl;
  cuitControl: FormControl;

  supplierForm: FormGroup

  constructor(private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    public dialogRef: MatDialogRef<AddSupplierDialogComponent>) {

      this.nameControl = new FormControl()
      this.organizationControl = new FormControl();
      this.contactNumberControl = new FormControl();
      this.emailControl = new FormControl();
      this.cuitControl = new FormControl();

      this.supplierForm = formBuilder.group({
        name: this.nameControl,
        organization: this.organizationControl,
        contactNumber: this.contactNumberControl,
        email: this.emailControl,
        cuit: this.cuitControl
      })

      this.dialogRef.disableClose = true;
      this.suppliersCreated = [];

    }

  ngOnInit(): void {
  }

  create(){

  }

  close(){
    this.dialogRef.close(this.suppliersCreated)
  }
}

export interface Supplier{
  id: number,
  organization: String,
  contactName: String,
  contactNumber: String,
  email: String,
  cuit: String
}


