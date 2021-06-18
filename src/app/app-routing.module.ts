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
import { ReportsComponent } from './reports/reports.component';
import { AuthorizatedGuard } from './login/core/authorizated.guard';
import { PurchasesComponent } from './purchases/purchases.component';
import { SupplierComponent } from './supplier/supplier.component'
import { SettingsComponent } from './settings/settings.component'
import { OnlineSalesComponent } from './online-sales/online-sales.component';

export const routes: Routes = [
  { path: "login", component: LoginComponent},
  { path: "home", component: HomeComponent, canActivate: [AuthorizatedGuard], children: [
    { path: "sales", component: SalesComponent, canActivate: [AuthorizatedGuard]},
    { path: "sales/invoice", component: SaleInvoiceComponent, canActivate: [AuthorizatedGuard]},
    { path: "branch", component: BranchComponent, canActivate: [AuthorizatedGuard]},
    { path: "client-lookup-dialog", component: ClientLookupDialogComponent, canActivate: [AuthorizatedGuard]},
    { path: "stock", component: StockComponent, canActivate: [AuthorizatedGuard]},
    { path: "cash", component: CashComponent, canActivate: [AuthorizatedGuard]},
    { path: "mdm", component: MdmComponent, canActivate: [AuthorizatedGuard]},
    { path: "customer", component: CustomerManagementComponent, canActivate: [AuthorizatedGuard]},
    { path: "reports", component: ReportsComponent, canActivate: [AuthorizatedGuard]},
    { path: "purchase", component: PurchasesComponent, canActivate: [AuthorizatedGuard]},
    { path: "supplier", component: SupplierComponent, canActivate: [AuthorizatedGuard]},
    { path: "setting", component: SettingsComponent, canActivate: [AuthorizatedGuard]},
    { path: "online-sale", component: OnlineSalesComponent, canActivate: [AuthorizatedGuard]}
  ]},
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
