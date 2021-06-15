import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CashSummaryComponent } from '../cash-summary/cash-summary.component';
import { BranchService } from '../service/branch.service';
import { CashService, TotalResponse } from '../service/cash.service';


@Component({
  selector: 'app-cash-report',
  templateUrl: './cash-report.component.html',
  styleUrls: ['./cash-report.component.css']
})
export class CashReportComponent implements OnInit {
  
  movementsIncome = new MatTableDataSource<TotalResponse>();
  movementsExpense = new MatTableDataSource<TotalResponse>();
  displayedColumns: string[] = [ 'payment_method','card','source','monto'];

  cashOpened=0; 
  branch: String;

  constructor(
    private cashService: CashService,
    private branchService: BranchService,
    private cashSummary: CashSummaryComponent,
    public changeDetectorRef: ChangeDetectorRef,
  ) { 
    this.cashOpened = this.cashSummary.cashOpened;
    this.initTotals();
    this.getBranch();
    
  }

  ngOnInit(): void {
  }


  initTotals() {


  //   this.cashService.getTotal(this.branchService.selectedBranch)
     this.cashService.getTotal(1)
       .subscribe(
         (response) => {
           console.log(JSON.stringify(response));
           this.movementsIncome.data = response.totals.filter((it)=>it.movement_type =="INGRESO");   
           this.movementsExpense.data = response.totals.filter((it)=>it.movement_type =="EGRESO");   
         },
         (error) => {
           Swal.fire({
             icon: "error",
             title: "Error",
             text: "No se pudieron cargar los ingresos de la Caja"
           });

         }
       );

   }

    
getTotalCostIncome() {
  return this.movementsIncome.data.map(t => t.total).reduce((acc, value) =>  acc + value, 0);
}

getTotalCostExpense() {
  return this.movementsExpense.data.map(t => t.total).reduce((acc, value) =>  acc + value, 0);
}

getBranch(){
this.branchService.getAll()
      .subscribe(
        (response) => {
         this.branch =response.branches.filter((it)=>it.id=this.branchService.selectedBranch)[0].name
         console.log(JSON.stringify(this.branch))
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se obtuvo la sucursal"
          })
        }
      )
}

exportTable(){
  this.cashOpened = this.cashSummary.cashOpened;
  let cashStatus= this.cashOpened==0?"CERRADA":"ABIERTA"
  
  PrintTable.exportToPdf("MovementsTableInc","MovementsTableExp",cashStatus, this.getBalanceCash(),this.branch);
}

getBalanceCash(){
  let income_cash= this.movementsIncome.data.filter((it)=>it.movement_type =="INGRESO" && it.payment_method =="Efectivo");         
  let total_cash_income: number=income_cash.map(t => t.total).reduce((acc, value) =>  acc + value, 0);
  let expense_cash = this.movementsExpense.data.filter((it)=>it.movement_type =="EGRESO" && it.payment_method =="Efectivo");
  let total_cash_expense: number=expense_cash.map(t => t.total).reduce((acc, value) =>  acc + value, 0);
  return (total_cash_income - total_cash_expense)
}


}
export class PrintTable {
  static exportToPdf(tableId1: string,tableId2: string, status?: string, balance?: number, branch?: String) {
     let printContentIncome, printContentExpense, popupWin;
     let date: Date = new Date();
    
    printContentIncome = document.getElementById(tableId1).innerHTML;
    printContentExpense = document.getElementById(tableId2).innerHTML;

    console.log(printContentIncome)
    console.log(printContentExpense)
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
  <html>
    <head>
      <title>Hefesto</title>
      <h2>Reporte Consolidado de Caja</h2>  
      <h4>Sucursal: ${branch} </h4>
      <h4>Fecha: ${date}  </h4>
      <h4>Estado de la caja: ${status}</h4>
      <h4>Saldo Efectivo: ${balance}</h4>
      <style type="text/css">
        body {
          color: #000;
          background: #01327B0F;
          font-family: Helvetica, Arial, sans-serif;
          text-align: center;
        }
        #page {
          width: 600px;
          text-align: left;
          margin: 0 auto;
          padding: 2em;
          background: #fff;
        }

        /* the table */

        table {
          width: 100%;
          border: 1px solid #000;
          border-collapse: collapse;
          caption-side: top;
          font-size: medium
          }
        th, td {
          width: 25%;
          text-align: left;
          vertical-align: top;
          border: 1px solid #000;
          padding: 0.3em;
          font-size: medium
        }
        caption {
          padding: 0.3em;
          color: #fff;
          background: #000;
        }
        th {
          background: #01327B3D;
        }
        td {
          background: #f4f4f4;
        }
        .odd td {
          background: #fff;
        }
        .elements {
          width: 30%;
        }
        .tag {
          width: 15%;
        }
        .purpose {
          width: 55%;
        }
        h3,h4{ 
          text-align: left;
        }
      </style>
    </head>
    <body onload="window.print();window.close()">
      <h3> Ingreso </h3>
      <table class="table table-bordered">${printContentIncome}</table>
      <h3> Egreso </h3>
      <table class="table table-bordered">${printContentExpense}</table>
    </body>
  </html>`
    );
    popupWin.document.close();
  }
}