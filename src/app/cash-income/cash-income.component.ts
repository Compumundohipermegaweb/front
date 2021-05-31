import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cash-income',
  templateUrl: './cash-income.component.html',
  styleUrls: ['./cash-income.component.css']
})
export class CashIncomeComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns = ['id','date','transaction','reference', 'payment','amount'];
  incomes = new MatTableDataSource<String>()

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {   
    this.incomes.paginator = this.paginator; 
  }
  

}
