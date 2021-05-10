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
      invoice_id: "00000912311909",
      invoice_type: "B",
      invoice_address: "Calle falsa 123",
      client: {
        name: "Nombre Cliente",
        document: {
          type: "DNI",
          value: "40060441"
        },
        invoice_address: "Falsa calle 321"
      },
      branch: {
        address: "Calle falsa 123",
        contact: "+54 011 6914 0099",
        cuit: "20-40060441-0",
        gross_income: "yoquese",
        activity_since: "Ayer"
      },
      detail: [
        { id: "1", sku: 1, detail: "Martillo", quantity: 1, price: 850 },
        { id: "2", sku: 2, detail: "Pinza de mano", quantity: 1, price: 700 },
        { id: "3", sku: 3, detail: "Clavos", quantity: 50, price: 0.5 }
      ],
      sub_total: 0,
      iva: 0,
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
