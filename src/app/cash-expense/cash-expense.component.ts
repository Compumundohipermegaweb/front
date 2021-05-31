import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cash-expense',
  templateUrl: './cash-expense.component.html',
  styleUrls: ['./cash-expense.component.css']
})
export class CashExpenseComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns = ['id','date','transaction','reference', 'payment','amount'];
  expenses = new MatTableDataSource<String>()

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {   
    this.expenses.paginator = this.paginator; 
  }


}
