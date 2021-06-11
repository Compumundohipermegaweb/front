import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-schedule-dialog',
  templateUrl: './edit-schedule-dialog.component.html',
  styleUrls: ['./edit-schedule-dialog.component.css']
})
export class EditScheduleDialogComponent implements OnInit {

  scheduleForm: FormGroup;
  scheduleControl: FormControl;

  constructor(public dialogRef: MatDialogRef<EditScheduleDialogComponent>, private formBuilder: FormBuilder)
   {
      this.scheduleControl = new FormControl();

      this.scheduleForm = formBuilder.group({
        schedule: this.scheduleControl
      })
      
      this.dialogRef.disableClose = true
   }

  ngOnInit(): void {
  }

  change(){

  }

  close(){

  }

}
