import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { BranchService } from '../service/branch.service';
import { CashService, TotalResponse } from '../service/cash.service';


@Component({
  selector: 'app-cash-report',
  templateUrl: './cash-report.component.html',
  styleUrls: ['./cash-report.component.css']
})
export class CashReportComponent implements OnInit {
  
  movementsIncome? = new MatTableDataSource<TotalResponse>();
  movementsExpense? = new MatTableDataSource<TotalResponse>();
  movementsIncomeDetail? = new MatTableDataSource<TotalResponse>();
  movementsExpenseDetail? = new MatTableDataSource<TotalResponse>();
  columnsConsolidado: string[] = [ 'payment_method','source','monto'];
  columnsDetallado: string[] = [ 'payment_method','source','card','digits','detail','monto'];

  cashOpened=0; 
  branch: String;
  reportType = new FormControl();

  constructor(
    private cashService: CashService,
    private branchService: BranchService,
    public changeDetectorRef: ChangeDetectorRef,
  ) { 
    this.getBranch();
    this.initTotals();
    this.reportType.setValue("consolidado");

  }

  ngOnInit(): void {
  }


  initTotals() {
    let branchId = this.branchService.selectedBranch | 0

    this.cashService.getTotal(branchId)
       .subscribe(
         (response) => {
           console.log(JSON.stringify(response));
           this.movementsIncome.data = response.totals.filter((it)=>it.movement_type =="INGRESO" && it.level<=2);   
           this.movementsExpense.data = response.totals.filter((it)=>it.movement_type =="EGRESO" && it.level<=2);  
           this.movementsIncomeDetail.data = response.totals.filter((it)=>it.movement_type =="INGRESO" );   
           this.movementsExpenseDetail.data = response.totals.filter((it)=>it.movement_type =="EGRESO" );  
           
           this.chartDatasets  = [
            { data: this.getIncomeChart(), label: 'Ingresos' },
            { data: this.getExpenseChart(), label: 'Egresos' }
          ];
         },
         (error) => {
           Swal.fire({
             icon: "error",
             title: "Error",
             text: "No se pudieron cargar los ingresos de la Caja"
           });

         }
       );

    this.cashOpened = this.cashService.getCurrentCash() | 0

   }

    
getTotalCostIncome() {
  let income =this.movementsIncome.data.filter((it)=>it.movement_type =="INGRESO" && it.level==1)
  return income.map(t => t.total).reduce((acc, value) =>  acc + value, 0);
}

getTotalCostExpense() {
  let expense = this.movementsExpense.data.filter((it)=>it.movement_type =="EGRESO" && it.level==1)
  return expense.map(t => t.total).reduce((acc, value) =>  acc + value, 0);
}

getBranch(){
this.branchService.getAll()
      .subscribe(
        (response) => {
         this.branch =response.branches.filter((it)=>it.id=this.branchService.selectedBranch)[0].branch
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
  this.cashOpened = this.cashService.getCurrentCash() | 0;
  let cashStatus= this.cashOpened==0?"CERRADA":"ABIERTA"

  if (this.reportType.value =="consolidado"){
    PrintTable.exportToPdf("MovementsTableInc","MovementsTableExp",cashStatus, this.getBalanceCash(),this.branch,"Consolidado");
  }else{
    PrintTable.exportToPdf("MovementsTableIncDet","MovementsTableExpDet",cashStatus, this.getBalanceCash(),this.branch, "Detallado");
  }
}

getBalanceCash(){

 let total_cash_income: number= this.movementsIncome.data.find((it)=>it.movement_type =="INGRESO" && it.payment_method =="Efectivo" && it.level==1)?.total |0 ;
 let total_cash_expense: number=this.movementsExpense.data.find((it)=>it.movement_type =="EGRESO" && it.payment_method =="Efectivo" && it.level==1)?.total |0 ; 
 return (total_cash_income - total_cash_expense)

}

reload() {
  this.getBranch();
  this.initTotals();
  this.chartDatasets  = [
    { data: this.getIncomeChart(), label: 'Ingresos' },
    { data: this.getExpenseChart(), label: 'Egresos' }
  ];

}

getIncomeChart(): Array<number>{

  return  [this.movementsIncome.data.find((it)=>it.movement_type =="INGRESO" && it.payment_method =="Efectivo" && it.level==1)?.total |0
          ,this.movementsIncome.data.find((it)=>it.movement_type =="INGRESO" && it.payment_method =="Cuenta corriente" && it.level==1)?.total |0
          ,this.movementsIncome.data.find((it)=>it.movement_type =="INGRESO" && it.payment_method =="Tarjeta de crédito" && it.level==1)?.total |0
          ,this.movementsIncome.data.find((it)=>it.movement_type =="INGRESO" && it.payment_method =="Tarjeta de débito" && it.level==1)?.total |0
          ,this.movementsIncome.data.find((it)=>it.movement_type =="INGRESO" && it.payment_method =="Mercadopago" && it.level==1)?.total |0
          ,this.movementsIncome.data.find((it)=>it.movement_type =="INGRESO" && it.payment_method =="Ahora 12" && it.level==1)?.total |0
          ]
}

getExpenseChart(): Array<number>{

  return  [this.movementsExpense.data.find((it)=>it.movement_type =="EGRESO" && it.payment_method =="Efectivo" && it.level==1)?.total |0
          ,this.movementsExpense.data.find((it)=>it.movement_type =="EGRESO" && it.payment_method =="Cuenta corriente" && it.level==1)?.total |0
          , 0, 0, 0, 0]
}


public chartType: string = 'bar';

public chartDatasets: Array<any> = [
  { data: this.getIncomeChart(), label: 'Ingresos' },
  { data: this.getExpenseChart(), label: 'Egresos' }
];

public chartLabels: Array<any> = ['Efectivo', 'Cuenta Corriente', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Mercado Pago', 'Ahora 12'];

public chartColors: Array<any> = [
  {
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 99, 132, 0.2)',
    ],
    borderColor: [
      'rgba(255,99,132,1)',
      'rgba(255,99,132,1)',
      'rgba(255,99,132,1)',
      'rgba(255,99,132,1)',
      'rgba(255,99,132,1)',
      'rgba(255,99,132,1)',
    ],
    borderWidth: 2,
  },
  {
    backgroundColor: [
      'rgba(54, 162, 235, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(54, 162, 235, 0.2)',
    ],
    borderColor: [
      'rgba(54, 162, 235, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(54, 162, 235, 1)',
    ],
    borderWidth: 2,
  }
];

public chartOptions: any = {
  responsive: true
};
public chartClicked(e: any): void { }
public chartHovered(e: any): void { }

}
export class PrintTable {
  static exportToPdf(tableId1: string,tableId2: string, status?: string, balance?: number, branch?: String, typeReport?: String) {
    let printContentIncome, printContentExpense, popupWin;
    let date=new Date().toLocaleString();
    
    printContentIncome = document.getElementById(tableId1).innerHTML;
    printContentExpense = document.getElementById(tableId2).innerHTML;
  
    var canvas = <HTMLCanvasElement> document.getElementById("Chart");
    var img    = canvas.toDataURL("image/png");

    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
  <html>
    <head>
      <title>Hefesto</title>
      <h2>Reporte ${typeReport} de Caja</h2>  
      <h4>Sucursal: ${branch} </h4>
      <h4>Fecha: ${date}  </h4>
      <h4>Estado de la caja: ${status}</h4>
      <h4>Saldo Efectivo: $ ${balance}</h4>
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
      <h3> Gráfico</h3>
      <img src='${img}'/>
    </body>
  </html>`
    );
    popupWin.document.close();
  }
}
