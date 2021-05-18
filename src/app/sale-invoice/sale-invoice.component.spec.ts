import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SaleInvoiceComponent } from './sale-invoice.component';

describe('SaleInvoiceComponent', () => {
  let component: SaleInvoiceComponent;
  let fixture: ComponentFixture<SaleInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleInvoiceComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: Router, useClass: RouterStub}
      ]
    })
    .compileComponents();
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class RouterStub {
  
  getCurrentNavigation() {
    return {
      extras: {
        state: {
          data: {
            invoice_id: "String",
            billing_date: "",
            type: "String",
            client: {
              document_number: "String",
              first_name: "String",
              last_name: "String",
              state: "String",
              credit_limit: 100,
              email: "String",
              contact_number: "String"
            },
            branch_address: "String",
            branch_contact: "String",
            cuit: "String",
            activity_since: "String",
            sale_details: {
              sale_details: [
                {
                  id: 1,
                  description: "String",
                  quantity: 10,
                  unit_price: 1
                }
              ]
            },
            subtotal: 100,
            iva_subtotal: 100,
            total: 100
          }
        }
      }
    }
  }
}
