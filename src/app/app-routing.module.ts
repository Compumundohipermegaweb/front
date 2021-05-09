import { SalesComponent } from './sales/sales.component'

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';

export const routes: Routes = [
  { path: "sales", component: SalesComponent },
  { path: "sales/invoice", component: SaleInvoiceComponent }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
