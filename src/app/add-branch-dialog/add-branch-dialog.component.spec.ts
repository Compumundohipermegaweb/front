import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBranchDialogComponent } from './add-branch-dialog.component';

describe('AddBranchDialogComponent', () => {
  let component: AddBranchDialogComponent;
  let fixture: ComponentFixture<AddBranchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBranchDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBranchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
