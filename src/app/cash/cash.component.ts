import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css']
})
export class CashComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

export interface Cash{
  cash_id: number,
  branch_id: number,
  point_of_sale: number,
  status: String
}

