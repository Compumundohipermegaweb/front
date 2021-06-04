import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerialReportsComponent } from './managerial-reports.component';

describe('ManagerialReportsComponent', () => {
  let component: ManagerialReportsComponent;
  let fixture: ComponentFixture<ManagerialReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerialReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerialReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
