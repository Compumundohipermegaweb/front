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
import {MatTabsModule} from '@angular/material/tabs';


import { registerLocaleData } from '@angular/common';
import localEsAr from "@angular/common/locales/es-AR";
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { StockComponent } from './stock/stock.component';

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
    StockComponent
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
    MatTabsModule
  ],
  providers: [CurrencyPipe],
  bootstrap: [AppComponent, NavBarComponent]
})
export class AppModule { }
