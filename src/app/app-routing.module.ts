import { SalesComponent } from './sales/sales.component'
import { BranchComponent } from './branch/branch.component'
import { StockComponent } from './stock/stock.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { ClientLookupDialogComponent } from './client-lookup-dialog/client-lookup-dialog.component';
import { CashComponent } from './cash/cash.component';
import { MdmComponent } from './mdm/mdm.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';


export const routes: Routes = [
  { path: "sales", component: SalesComponent },
  { path: "sales/invoice", component: SaleInvoiceComponent },
  { path: "branch", component: BranchComponent},
  { path: "client-lookup-dialog", component: ClientLookupDialogComponent},
  { path: "stock", component: StockComponent},
  { path: "cash", component: CashComponent},
  { path: "mdm", component: MdmComponent},
  { path: "login", component: LoginComponent},
  { path: "home", component: HomeComponent},
  { path: "asd", component: AddPaymentMethodComponent}
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
