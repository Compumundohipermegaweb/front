import { Component, OnInit } from '@angular/core';
import { AdminGuard } from '../login/core/admin.guard';
import { CashierGuard } from '../login/core/cashier.guard';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private cashierGuard: CashierGuard, private adminGuard: AdminGuard) { }

  ngOnInit(): void {
  }

  isCashier() {
    return this.cashierGuard.canActivate()
  }

  isAdmin() {
    return this.adminGuard.canActivate()
  }

}
