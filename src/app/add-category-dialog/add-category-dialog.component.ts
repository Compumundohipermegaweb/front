import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.css']
})
export class AddCategoryDialogComponent implements OnInit {

  nameControl: FormControl
  descriptionControl: FormControl

  categoryForm: FormGroup

  constructor(
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>, 
    private formBuilder: FormBuilder
  ) { 

    this.nameControl = new FormControl()
    this.descriptionControl = new FormControl()

    this.categoryForm = formBuilder.group({
      name:  this.nameControl,
      description: this.descriptionControl
    })

    this.dialogRef.disableClose = true
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close()
  }
}
