import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Cash } from '../cash/cash.component';
import { CashService ,OpenRequest, CloseRequest,CashResponse} from '../service/cash.service';

@Component({
  selector: 'app-cash-summary',
  templateUrl: './cash-summary.component.html',
  styleUrls: ['./cash-summary.component.css']
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
    
    // User 
    userId =1;
    cashOpened=0;
    
    //Summary
    displayedColumns: string[] = ['movement', 'amount'];
    transactions: Transaction[] = [
      {movement: 'Ingreso', amount: 0},
      {movement: 'Egreso', amount: 0},
    ];

    constructor(
      private cashService: CashService,
      public changeDetectorRef: ChangeDetectorRef,
      
    ) { 
     
     
      this.getCashOpenByUserId(this.userId);
      this.initCashRegisters() ;  

    }

    initCashRegisters() {
            
      this.cashService.getAllCash()
        .subscribe(
          (response) => {
            this.cashRegisters = response.cash_registers;
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

    /** Gets the difference between income and expense */
    getTotalCost() {
      return this.transactions.map(t => t.amount).reduce((acc, value) => - acc - value, 0);
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
           console.log(JSON.stringify(this.cash.data));
           Swal.fire({
            icon: "success",
            title: "La caja fue abierta",
          });
          },
  
          (error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "No se pudo abrir la caja"
            });
          }
        );
        this.cashForm.setValue(null)
        this.openBalanceForm.setValue(null)
      

    }

    closeCashRegister(){

        let closeRequest = {
          cash_id: 1,//this.cashOpened,
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
            },
    
            (error) => {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo cerrada la caja"
              });
            }
          );
          
          this.closeBalanceForm.setValue(null);
          this.changeDetectorRef.detectChanges();
      }  

    getCashOpenByUserId(userId: number){

      this.cashService.getCashOpenByUser(userId)
      .subscribe(
        response => {
          this.cashOpened= response.cash_start_end_id;
        },
        (error) => {
          this.cashOpened=0
        }
      );
    }


  }

  interface Transaction {
    movement: string;
    amount: number;
  }

