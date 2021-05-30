import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashExpenseComponent } from './cash-expense.component';

describe('CashExpenseComponent', () => {
  let component: CashExpenseComponent;
  let fixture: ComponentFixture<CashExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashExpenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
