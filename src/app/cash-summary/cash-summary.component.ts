import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-cash-summary',
  templateUrl: './cash-summary.component.html',
  styleUrls: ['./cash-summary.component.css']
})
 export class CashSummaryComponent implements OnInit {


    constructor(
      public changeDetectorRef: ChangeDetectorRef,
    ) { }

    // Open Cash
    cashForm = new FormControl();
    options: Cash[] = [
      {name: '#001'},
      {name: '#002'},
      {name: '#003'}
    ];
    filteredOptions: Observable<Cash[]>; 
    openBalanceForm = new FormControl();

    // Close Cash
    closeBalanceForm = new FormControl();




    //Summary

    displayedColumns: string[] = ['movement', 'amount'];
    transactions: Transaction[] = [
      {movement: 'Ingreso', amount: 2000},
      {movement: 'Egreso', amount: 3000},
    ];

  
    ngOnInit() {


      this.filteredOptions = this.cashForm.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
    }
  
    ngAfterViewInit(): void {   
      
    }
    
    displayFn(cash: Cash): string {
      return cash && cash.name ? cash.name : '';
    }
  
    private _filter(name: string): Cash[] {
      const filterValue = name.toLowerCase();
  
      return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
  
    /** Gets the difference between income and expense */
    getTotalCost() {
      return this.transactions.map(t => t.amount).reduce((acc, value) => - acc - value, 0);
    }
  }

  interface Transaction {
    movement: string;
    amount: number;
  }
  export interface Cash {
    name: string;
  }


