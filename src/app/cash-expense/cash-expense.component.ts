import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CashService } from '../service/cash.service';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-cash-expense',
  templateUrl: './cash-expense.component.html',
  styleUrls: ['./cash-expense.component.css'],  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CashExpenseComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;

  columns = ['supplier','paymentMethods','source', 'description','amount','actions'];
  expenses = new MatTableDataSource<CashMovementExpense>()
  cashOpened = 0

  constructor(
    public changeDetectorRef: ChangeDetectorRef,
    private cashService: CashService,
    private addExpenseDialog: MatDialog,

  ) { 

  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {   
    this.loadExpenses(this.cashService.getCurrentCash());
    this.expenses.paginator = this.paginator; 
    this.changeDetectorRef.detectChanges;
  }

  loadExpenses(cashMovId: number) {
    this.changeDetectorRef.markForCheck;
    this.cashService.getExpenses(cashMovId)
      .subscribe(
        (response) => {
          console.log(JSON.stringify(response))
          this.expenses.data = response.expenses;
          console.log(JSON.stringify(this.expenses.data))        
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar los Egresos de Caja"
          });
        }
      );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.expenses.filter = filterValue.trim().toLowerCase();
  }

  add(){
    const dialogRef = this.addExpenseDialog.open(AddExpenseDialogComponent, {})

    dialogRef.afterClosed()
      .subscribe(
        (result: CashMovementExpense[]) => {
          if(result && result.length > 0) {
            this.expenses.data.forEach(
              (expense: CashMovementExpense) => {
                result.push(expense)
              }
            )
            this.expenses.data = result
          }
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

  reload() {
    this.loadExpenses(this.cashService.getCurrentCash())
  }

 
}

export interface CashMovementExpense{
  id_movement: number,
  datetime: Date,
  transaction_id: number,
  source_description: String,
  detail: String,
  payment: String,
  amount: number
  
}
