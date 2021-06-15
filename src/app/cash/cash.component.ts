import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CashService } from '../service/cash.service';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
})
export class CashComponent implements OnInit {

  constructor(
    private cashService : CashService
  ) { }

  ngOnInit(): void {
  }

  getCurrentCash(){
    return this.cashService.getCurrentCash()

  }
}


export interface Cash {
  branch_id: number,
  cash_id: number,
  point_of_sale: number,
  status: String
}
