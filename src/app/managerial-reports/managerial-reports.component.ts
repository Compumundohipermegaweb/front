import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OnlineVsLocalResponse, RankingByBranchResponse, ReportService } from '../service/report.service';

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

  rankingByBranch: RankingByBranchResponse = {
    branches:[],
    sales_quantity: [0,0]
  }

  typeControl = new FormControl();
  type?: string;

  constructor(
    private reportService: ReportService
  ) {
    
    this.initChartOnlineVsLocal()
    this.initChartRanking()

   }

  ngOnInit(): void {
  }

  //Chart Ventas Online Vs Ventas Local

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

  initChartOnlineVsLocal() {
            
    this.reportService.getVentasOnlineVsLocal()
      .subscribe(
        (response) => {
          this.onlineVsLocal = response;
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

//Chart Ranking By Branch

  public chartTypeRanking: string = 'bar';

  public chartDatasetsRanking: Array<any> = [
    { data: [0], label: 'Ranking' }
  ];

  public chartLabelsRanking: Array<any> = [];

  public chartColorsRanking: Array<any> = [
    {
      backgroundColor: [
        'rgba(128, 0, 128, 0.8)',
        'rgba(247, 70, 74, 0.8)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 159, 64, 0.6)'
      ],
      borderColor: [
        'rgba(128, 0, 128, 1)',
        'rgba(247, 70, 74, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];

  public chartOptionsRanking: any = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                userCallback: function(label, index, labels) {
                    // when the floored value is the same as the value we have a whole number
                    if (Math.floor(label) === label) {
                        return label;
                    }
                },
            }
        }],
    },
  }


  public chartClickedRanking(e: any): void { }
  public chartHoveredRanking(e: any): void { }



  initChartRanking() {
            
    this.reportService.getRankingByBranch()
      .subscribe(
        (response) => {
          this.rankingByBranch = response
          console.log(JSON.stringify(this.rankingByBranch))
          this.chartLabelsRanking = []
          this.rankingByBranch.branches.forEach((it)=> this.chartLabelsRanking.push(it.branch))
          this.chartDatasetsRanking = [
            { data: this.rankingByBranch.sales_quantity, label: 'Ranking'}
          ];
          
        },
        (error) => {
          this.rankingByBranch = null
        }
      );
    
      }

}
