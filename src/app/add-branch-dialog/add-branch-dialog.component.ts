import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Branch } from '../branch/branch.component';
import { BranchResponse, BranchService, PostBranchRequest } from '../service/branch.service';

@Component({
  selector: 'app-add-branch-dialog',
  templateUrl: './add-branch-dialog.component.html',
  styleUrls: ['./add-branch-dialog.component.css']
})
export class AddBranchDialogComponent implements OnInit {

  branchForm: FormGroup;
  creatingBranch = false;

  nameControl: FormControl;
  addressControl: FormControl;
  contactNumberControl: FormControl;
  emailControl: FormControl;
  attentionScheduleControl: FormControl;
  postalCodeControl: FormControl;

  createdBranch: BranchResponse[];

  branchs: BranchResponse[];

  repetido: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddBranchDialogComponent>, 
    private formBuilder: FormBuilder,
    private branchService: BranchService
  ) {
    this.createdBranch = []

    this.nameControl = new FormControl()
    this.addressControl = new FormControl()
    this.attentionScheduleControl = new FormControl()
    this.contactNumberControl = new FormControl()
    this.emailControl = new FormControl()
    this.postalCodeControl = new FormControl()

    this.branchForm = formBuilder.group({
      name: this.nameControl,
      address: this.addressControl,
      attentionSchedule: this.attentionScheduleControl,
      contactNumber: this.contactNumberControl,
      email: this.emailControl,
      postalCode: this.postalCodeControl
    })

    this.dialogRef.disableClose = true;

    this.fetchBranchs()
  }

  ngOnInit(): void {
  }

  fetchBranchs(){
    this.branchs = []

    this.branchService.getAll()
      .subscribe(
        (response) => {
          this.branchs = response.branches
        })
      }

  createBranch(){
    this.creatingBranch = true;

    if(this.branchForm.invalid) {
      this.creatingBranch = false;
      return;
    }

    let branch: PostBranchRequest = {
      branch: this.nameControl.value,
      address: this.addressControl.value,
      email: this.emailControl.value,
      contact_number: this.contactNumberControl.value,
      postal_code: this.postalCodeControl.value,
      attention_schedule: this.attentionScheduleControl.value
      }

      this.branchService.newBranch(branch)
      .subscribe(
        (response) => {
          this.creatingBranch = false;
          Swal.fire({
            icon: "success",
            title: "¡Sucursal creada!"
          });

          this.createdBranch.push(response);
          console.log("Sucursales creadas = " + this.createdBranch.length)
          this.close()
        },

        (error) => {
          this.creatingBranch = false;
          Swal.fire({
            icon: "error",
            title: "Fallo al crear la nueva Sucursal",
            text: "No se pudo crear la sucursal, revise los campos y vuelva a intentar. Si el error persiste contacte un administrador"
          });
        }
      );
  }

  validateAddress(){
    this.repetido = false;
    this.branchs.forEach(element => {
      if(element.address == this.addressControl.value){
        this.repetido = true;
        this.addressControl.setErrors({"invalid": true});
      }
    });
    if(this.repetido == false){
      this.addressControl.setErrors(null)
    }
    
  }

  getAddressErrors() {
    if(this.addressControl.hasError("invalid")) {
      return " Sucursal Existente ";
    }
  }


  close() {
    this.dialogRef.close(this.createdBranch)
  }

}
