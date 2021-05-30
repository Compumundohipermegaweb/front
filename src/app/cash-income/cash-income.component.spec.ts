import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashIncomeComponent } from './cash-income.component';

describe('CashIncomeComponent', () => {
  let component: CashIncomeComponent;
  let fixture: ComponentFixture<CashIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
