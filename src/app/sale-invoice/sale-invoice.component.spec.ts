import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleInvoiceComponent } from './sale-invoice.component';

describe('SaleInvoiceComponent', () => {
  let component: SaleInvoiceComponent;
  let fixture: ComponentFixture<SaleInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    history.replaceState({data: {
      id: 1234,
      billingDate: "String",
      type: "B",
      branchAddress: "Calle falsa 123",
      branchContact: "String",
      cuit: "String",
      activitySince: "String",
      client: {
        document_number: "String",
        first_name: "String",
        last_name: "String",
        sur_name: "String",
        category: "String",
        email: "String",
        contact_number: "String",
      },
      saleDetails: {
        sale_details: [
          { id: "1", sku: 1, desscription: "Martillo", quantity: 1, unit_price: 850 },
          { id: "2", sku: 2, desscription: "Pinza de mano", quantity: 1, unit_price: 700 },
          { id: "3", sku: 3, desscription: "Clavos", quantity: 50, unit_price: 0.5 }
        ]
      },
      subTotal: 0,
      ivaSubTotal: 0,
      total: 1575,
    } }, "")
    fixture = TestBed.createComponent(SaleInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
