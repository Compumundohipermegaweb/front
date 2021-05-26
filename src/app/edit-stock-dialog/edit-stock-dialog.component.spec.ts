import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { EditStockDialogComponent } from './edit-stock-dialog.component';

describe('EditStockDialogComponent', () => {
  let component: EditStockDialogComponent;
  let fixture: ComponentFixture<EditStockDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStockDialogComponent ],
      imports: [
        MatDialogModule
      ],
        providers: [
          HttpClient, 
          HttpHandler, 
          { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: {} },
          { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false }}
        ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStockDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
