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
      <title>Hefesto</title>
      <h1>Reporte de Caja</h1>
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
          }
        th, td {
          width: 25%;
          text-align: left;
          vertical-align: top;
          border: 1px solid #000;
          padding: 0.3em;
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
      </style>
    </head>
    <body onload="window.print();window.close()"><table class="table table-bordered">${printContents}</table></body>
  </html>`
    );
    popupWin.document.close();
  }
}