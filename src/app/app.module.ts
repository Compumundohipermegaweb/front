import { AppComponent } from './app.component';
import { SalesComponent } from './sales/sales.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BranchComponent } from './branch/branch.component';
import { ClientLookupDialogComponent } from './client-lookup-dialog/client-lookup-dialog.component';
import { ItemLookupDialogComponent } from './item-lookup-dialog/item-lookup-dialog.component';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { MatStepperModule } from '@angular/material/stepper';
import { LocalCurrencyPipe } from './pipe/local-currency.pipe'
import { CurrencyPipe } from '@angular/common'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule} from '@angular/material/radio';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';


import { registerLocaleData } from '@angular/common';
import localEsAr from "@angular/common/locales/es-AR";
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { StockComponent } from './stock/stock.component';
import { ItemMasterComponent } from './item-master/item-master.component';
import { ItemsStockComponent } from './items-stock/items-stock.component';
import { NewItemDialogComponent } from './new-item-dialog/new-item-dialog.component';
import { EditStockDialogComponent } from './edit-stock-dialog/edit-stock-dialog.component';
import { CashComponent } from './cash/cash.component';
import { MdmComponent } from './mdm/mdm.component';
import { CashIncomeComponent } from './cash-income/cash-income.component';
import { CashExpenseComponent } from './cash-expense/cash-expense.component';
import { CashSummaryComponent } from './cash-summary/cash-summary.component';
import { CategoriesComponent } from './categories/categories.component';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { BrandsComponent } from './brands/brands.component';
import { AddUnitDialogComponent } from './add-unit-dialog/add-unit-dialog.component';
import { MeasurementUnitsComponent } from './measurement-units/measurement-units.component';
import { AddBrandDialogComponent } from './add-brand-dialog/add-brand-dialog.component';
import { LoginComponent } from './login/login.component'
import { ServiceWorkerModule } from '@angular/service-worker';
import {environment} from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { NewPaymentMethodComponent } from './new-payment-method/new-payment-method.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { ReportsComponent } from './reports/reports.component';
import { OperationalReportsComponent } from './operational-reports/operational-reports.component';
import { ManagerialReportsComponent } from './managerial-reports/managerial-reports.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AddSupplierDialogComponent } from './add-supplier-dialog/add-supplier-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { CashReportComponent } from './cash-report/cash-report.component';
import { AddExpenseDialogComponent } from './add-expense-dialog/add-expense-dialog.component';
import { AddIncomeDialogComponent } from './add-income-dialog/add-income-dialog.component';
import { PurchaseOrdersComponent } from './purchase-orders/purchase-orders.component';
import { DispatchesComponent } from './dispatches/dispatches.component';
import { OnlineSalesComponent } from './online-sales/online-sales.component';


registerLocaleData(localEsAr)

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    SalesComponent,
    LocalCurrencyPipe,
    SaleInvoiceComponent,
    BranchComponent,
    ClientLookupDialogComponent,
    ItemLookupDialogComponent,
    AddPaymentMethodComponent,
    StockComponent,
    ItemMasterComponent,
    ItemsStockComponent,
    NewItemDialogComponent,
    EditStockDialogComponent,
    CashComponent,
    MdmComponent,
    CashIncomeComponent,
    CashExpenseComponent,
    CashSummaryComponent,
    CategoriesComponent,
    AddCategoryDialogComponent,
    BrandsComponent,
    AddUnitDialogComponent,
    MeasurementUnitsComponent,
    AddBrandDialogComponent,
    LoginComponent,
    HomeComponent,
    PaymentMethodsComponent,
    NewPaymentMethodComponent,
    CustomerManagementComponent,
    ReportsComponent,
    OperationalReportsComponent,
    ManagerialReportsComponent,
    PurchasesComponent,
    SupplierComponent,
    AddSupplierDialogComponent,
    SettingsComponent,
    CashReportComponent,
    AddExpenseDialogComponent,
    AddIncomeDialogComponent,
    PurchaseOrdersComponent,
    DispatchesComponent,
    OnlineSalesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatDividerModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatButtonModule,
    AppRoutingModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatAutocompleteModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    MDBBootstrapModule.forRoot(),
    MatButtonToggleModule,
    MatTooltipModule
  ],
  providers: [CurrencyPipe],
  bootstrap: [AppComponent, NavBarComponent]
})
export class AppModule { }
