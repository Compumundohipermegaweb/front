import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OnlineVsLocalResponse, ReportService } from '../service/report.service';

@Component({
  selector: 'app-managerial-reports',
  templateUrl: './managerial-reports.component.html',
  styleUrls: ['./managerial-reports.component.css']
})
export class ManagerialReportsComponent implements OnInit {
  
  onlineVsLocal: OnlineVsLocalResponse = {
    sales_type: ["VENTA LOCAL","VENTA ONLINE"],
    sales_quantity: [0,0],
    sales_amount: [0,0]
  }

  typeControl = new FormControl();
  type?: string;

  constructor(
    private reportService: ReportService
  ) {
    
    this.initChart()

    console.log(JSON.stringify(this.onlineVsLocal.sales_quantity))
   }

  ngOnInit(): void {
  }

  public chartType: string = 'pie';

  public chartDatasets: Array<any> =[
    { data: this.onlineVsLocal.sales_quantity, label: 'Venta Online Vs Venta Local' }
  ];;

  public chartLabels: Array<any> = ['Venta Local','Venta Online'];

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#46BFBD','#FDB45C'],
      hoverBackgroundColor: ['#5AD3D1', '#FFC870'],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  initChart() {
            
    this.reportService.getVentasOnlineVsLocal()
      .subscribe(
        (response) => {
          this.onlineVsLocal = response;
          console.log(JSON.stringify(this.onlineVsLocal))
          this.chartDatasets =[
            { data: this.onlineVsLocal.sales_quantity, label: 'Venta Online Vs Venta Local' }
          ];
          this.typeControl.setValue("quantity")
        },
        (error) => {
          this.onlineVsLocal = null
        }
      );
    
      }

  refreshByQuantity(){

    this.chartDatasets =[
      { data: this.onlineVsLocal.sales_quantity, label: 'Venta Online Vs Venta Local' }
    ];

  }
  refreshByAmount(){

    this.chartDatasets =[
      { data: this.onlineVsLocal.sales_amount, label: 'Venta Online Vs Venta Local' }
    ];
    
  }

}
