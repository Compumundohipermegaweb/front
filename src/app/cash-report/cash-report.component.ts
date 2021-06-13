import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CashService, TotalResponse } from '../service/cash.service';

@Component({
  selector: 'app-cash-report',
  templateUrl: './cash-report.component.html',
  styleUrls: ['./cash-report.component.css']
})
export class CashReportComponent implements OnInit {
  
  
  movements = new MatTableDataSource<TotalResponse>();
  displayedColumns: string[] = [ 'payment_method','card','source','income','expense'];

  constructor(
    private cashService: CashService,
    public changeDetectorRef: ChangeDetectorRef,
  ) { 

    this.initTotals();
    
  }

  ngOnInit(): void {
  }

  initTotals() {

     this.cashService.getTotal(1)
       .subscribe(
         (response) => {
           console.log(JSON.stringify(response));
           this.movements.data = response.totals; 
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

/** Gets the difference between income and expense */
// getTotalCost() {
//   return this.transactions.map(t => t.amount).reduce((acc, value) => - acc - value, 0);
// }
exportTable(){
  PrintTable.exportToPdf("MovementsTable");
}


}
export class PrintTable {
  static exportToPdf(tableId: string, name?: string) {
     let printContents, popupWin;
    printContents = document.getElementById(tableId).innerHTML;
    console.log(printContents)
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
  <html>
    <head>
      <h1>Reporte de Caja</h1>
     
    </head>
    <body onload="window.print();window.close()"><table class="table table-bordered">${printContents}</table></body>
  </html>`
    );
    popupWin.document.close();
  }
}