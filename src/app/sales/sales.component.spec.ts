import { ComponentFixture, TestBed } from '@angular/core/testing';

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

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesComponent ],
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
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should add item", () => {
    component.constantsForm.setValue({invoice: "A", seller: "COD10", branchId: "SUC03"})
    component.itemForm.setValue({id: 1, sku: 1, detail: "Details", quantity: 10, price: 110.50})
    
    component.addItem()

    expect(component.items).toHaveSize(1)
  })

  it("should clean item form values", () => {
    component.constantsForm.setValue({invoice: "A", seller: "COD10", branchId: "SUC03"})
    component.itemForm.setValue({id: 1, sku: 1, detail: "Details", quantity: 10, price: 110.50})

    component.addItem()

    expect(component.idControl.value).toBeNull()
    expect(component.skuControl.value).toBeNull()
    expect(component.detailControl.value).toBeNull()
    expect(component.quantityControl.value).toBeNull()
    expect(component.priceControl.value).toBeNull()
  })

  it("should not add the item if form is not valid", () => {
    component.constantsForm.setValue({invoice: "A", seller: "COD10", branchId: "SUC03"})
    component.itemForm.setValue({id: null, sku: 1, detail: "Details", quantity: 10, price: 110.50})
    
    component.addItem()

    expect(component.items).toHaveSize(0)
  })

  it("should not clean constant form when adding item", () => {
    component.constantsForm.setValue({invoice: "A", seller: "COD10", branchId: "SUC03"})
    component.itemForm.setValue({id: 1, sku: 1, detail: "Details", quantity: 10, price: 110.50})
  
    component.addItem()

    expect(component.invoiceTypeControl.value).toBe("A")
    expect(component.sellerControl.value).toBe("COD10")
    expect(component.branchControl.value).toBe("SUC03")
  })

  it("should fail if constant form is invalid", () => {
    component.constantsForm.setValue({invoice: "A", seller: null, branchId: null})
    component.itemForm.setValue({id: 1, sku: 1, detail: "Details", quantity: 10, price: 110.50})

    component.addItem()

    expect(component.items).toHaveSize(0)
  })
})
