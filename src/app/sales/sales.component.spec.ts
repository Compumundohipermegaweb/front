import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";

import { SalesComponent } from './sales.component';

import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyPipe, Location } from '@angular/common';
import { LocalCurrencyPipe } from '../pipe/local-currency.pipe';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { routes } from '../app-routing.module'
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

describe('SalesComponent', () => {
  let location: Location;
  let router: Router
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesComponent, LocalCurrencyPipe ],
      imports: [
        MatDividerModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatListModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes),
        MatDialogModule
      ],
      providers: [ 
        CurrencyPipe, 
        HttpClient, 
        HttpHandler,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router.initialNavigation()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should add item", () => {
    component.constantsForm.setValue({invoice: "A", seller: "COD10", branchId: "SUC03", client: 40060441})
    component.itemForm.setValue({id: 1, sku: 1, description: "Details", quantity: 10, price: 110.50})

    component.addItem()

    expect(component.items).toHaveSize(1)
  })

  it("should clean item form values", () => {
    component.constantsForm.setValue({invoice: "A", seller: "COD10", branchId: "SUC03", client: 40060441})
    component.itemForm.setValue({id: 1, sku: 1, description: "Details", quantity: 10, price: 110.50})

    component.addItem()

    expect(component.idControl.value).toBeNull()
    expect(component.skuControl.value).toBeNull()
    expect(component.descriptionControl.value).toBeNull()
    expect(component.quantityControl.value).toBeNull()
    expect(component.priceControl.value).toBeNull()
  })

  it("should not add the item if form is not valid", () => {
    component.constantsForm.setValue({invoice: "A", seller: "COD10", branchId: "SUC03", client: 40060441})
    component.itemForm.setValue({id: null, sku: 1, description: "Details", quantity: 10, price: 110.50})

    component.addItem()

    expect(component.items).toHaveSize(0)
  })

  it("should not clean constant form when adding item", () => {
    component.constantsForm.setValue({invoice: "A", seller: "COD10", branchId: "SUC03", client: 40060441})
    component.itemForm.setValue({id: 1, sku: 1, description: "Details", quantity: 10, price: 110.50})

    component.addItem()

    expect(component.invoiceTypeControl.value).toBe("A")
    expect(component.salesmanControl.value).toBe("COD10")
    expect(component.branchControl.value).toBe("SUC03")
  })

  it("should fail if constant form is invalid", () => {
    component.constantsForm.setValue({invoice: "A", seller: null, branchId: "SUC03", client: 40060441})
    component.itemForm.setValue({id: 1, sku: 1, description: "Details", quantity: 10, price: 110.50})

    component.addItem()

    expect(component.items).toHaveSize(0)
  })

  it("should cancel the sale", () => {
    component.constantsForm.setValue({invoice: "A", seller: "COD10", branchId: "SUC03", client: 40060441})
    component.items = [
      { id: 1, sku: 1, description: "Details", quantity: 10, price: 110.50 }, 
      { id: 2, sku: 22, description: "Details", quantity: 15, price: 25.10 }, 
      { id: 3, sku: 333, description: "Details", quantity: 3, price: 570.00 }
    ]

    component.cancelSale()

    expect(component.items).toHaveSize(0)
  });
})
