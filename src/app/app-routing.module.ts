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
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { ReportsComponent } from './reports/reports.component'
import { AuthorizatedGuard } from './login/core/authorizated.guard';


export const routes: Routes = [
  { path: "sales", component: SalesComponent },
  { path: "sales/invoice", component: SaleInvoiceComponent },
  { path: "branch", component: BranchComponent},
  { path: "client-lookup-dialog", component: ClientLookupDialogComponent},
  { path: "stock", component: StockComponent},
  { path: "cash", component: CashComponent},
  { path: "mdm", component: MdmComponent},
  { path: "login", component: LoginComponent},
  { path: "home", component: HomeComponent, canActivate: [AuthorizatedGuard]},
  { path: "customer", component: CustomerManagementComponent},
  { path: "reports", component: ReportsComponent},
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", redirectTo: "/home"}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthorizatedGuard]
})
export class AppRoutingModule { }
