import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cash } from '../cash/cash.component';
import { BranchService } from '../service/branch.service';
import { CashService ,OpenRequest, CloseRequest, CashResponse} from '../service/cash.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-cash-summary',
  templateUrl: './cash-summary.component.html',
  styleUrls: ['./cash-summary.component.css'],
 // providers:[CashIncomeComponent]
})
 export class CashSummaryComponent implements OnInit {

    cash = new MatTableDataSource<Cash>();

    //Search Cash Registers
    cashForm = new FormControl();
    cashRegisters: CashResponse	[] = []	
    selectedCash: Cash;
   
    // Open Cash
    openBalanceForm = new FormControl();
    openRequest: OpenRequest;
   
    // Close Cash
    closeBalanceForm = new FormControl();
    closeRequest: CloseRequest;
    cashId=0;
    
    // User 
    userId =1;
    cashOpened=0

    //Summary
    displayedColumns: string[] = ['movement', 'amount'];
    transactions: Transaction[] = [
      {movement: 'Ingreso', amount: 0},
      {movement: 'Egreso', amount: 0},
    ];
    
    constructor(
      private cashService: CashService,
      private branchService: BranchService,
      public changeDetectorRef: ChangeDetectorRef,
      private router: Router,
    ) { 
      this.cashOpened=this.cashService.getCurrentCash()
      this.getCashOpenByUserId(this.userId);
      this.initCashRegisters(); 
      this.getCashIdOpen();
      this.initTotalCash();
    }

    initCashRegisters() {
            
      this.cashService.getAllCash()
        .subscribe(
          (response) => {
            this.cashRegisters = response.cash_registers.filter((it)=>it.branch_id==this.branchService.selectedBranch);
          },
          (error) => {
            this.cashRegisters = []
          }
        );
      
        }
  
    ngOnInit() {     
    }
  
    ngAfterViewInit(): void {  
    }  

    selectCash(event) {
      this.selectedCash = {
        cash_id: event.value,
        point_of_sale: event.source.triggerValue,
        branch_id: event.source.triggerValue,
        status:event.source.triggerValue,
      }
    }

    openCash(){ 

      let openRequest = {
        cash_id: this.cashForm.value,
        user_id: this.userId,
        opening_balance:this.openBalanceForm.value
      }
    
      this.cashService.open(openRequest)
        .subscribe(
          (response) => { 
           Swal.fire({
            icon: "success",
            title: "La caja fue abierta",
          });
          this.getCashOpenByUserId(this.userId)
          this.initTotalCash()
          },
  
          (error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo abrir la caja"
            });
          }
        );
        this.cashForm.setValue(null);
        this.openBalanceForm.setValue(null);
    }

    closeCashRegister(){

      if ( this.cashId != 0 ){

        let closeRequest = {
          cash_id: this.cashId,
          user_id: this.userId,
          real_balance: this.closeBalanceForm.value,
          theoretical_balance: this.closeBalanceForm.value
        }
      
        this.cashService.close(closeRequest)
          .subscribe(
            (response) => { 
              Swal.fire({
              icon: "success",
              title: "La caja fue cerrada",
            });
            this.getCashOpenByUserId(this.userId)
            this.initTotalCash()
            },
    
            (error) => {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo cerrada la caja"
              });
            }
          );
          
      }else{
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cerrada la caja, validar que est?? seleccionada la sucursal"
        });
      }
      this.closeBalanceForm.setValue(null);
      
    }  

    getCashOpenByUserId(userId: number){

      this.cashService.getCashOpenByUser(userId)
      .subscribe(
        response => {
          this.cashService.setCurrentCash(response.cash_start_end_id);
          this.cashOpened = response.cash_start_end_id
        }
      );

    }

    getCashIdOpen() {
      this.cashService.getAllCash()
        .subscribe(
          (response) => {
            if(response.cash_registers) {
              let currentCash = response.cash_registers.find((it) => it.branch_id == this.branchService.selectedBranch)
              this.cashId = currentCash.cash_id
            }
          }
        )
    }


    reload() {
      this.getCashOpenByUserId(this.userId)
      this.initTotalCash();
    }

     /** Gets the difference between income and expense */
    public getTotalCost() {
      return this.transactions.map(t => t.amount).reduce((acc, value) => - acc - value, 0);
    }
    

    initTotalCash() {
      let branchId = this.branchService.selectedBranch | 0

      this.cashService.getTotal(branchId)
        .subscribe(
          (response) => {
            let total_cash_income: number= response.totals.find((it)=>it.movement_type =="INGRESO" && it.payment_method =="Efectivo" && it.level==1)?.total |0 ;
            let total_cash_expense: number=response.totals.find((it)=>it.movement_type =="EGRESO" && it.payment_method =="Efectivo" && it.level==1)?.total |0 ; 

            this.transactions = [
              {movement: 'Ingreso', amount: total_cash_income},
              {movement: 'Egreso', amount: total_cash_expense},
            ];
            this.closeBalanceForm.setValue(total_cash_income-total_cash_expense)
            this.changeDetectorRef.detectChanges()
            
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

  }

  interface Transaction {
    movement: string;
    amount: number;
  }