import { SalesComponent } from './sales/sales.component'
import { BranchComponent } from './branch/branch.component'
import { StockComponent } from './stock/stock.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { ClientLookupDialogComponent } from './client-lookup-dialog/client-lookup-dialog.component';


export const routes: Routes = [
  { path: "sales", component: SalesComponent },
  { path: "sales/invoice", component: SaleInvoiceComponent },
  { path: "branch", component: BranchComponent},
  { path: "client-lookup-dialog", component: ClientLookupDialogComponent},
  { path: "stock", component: StockComponent}
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
