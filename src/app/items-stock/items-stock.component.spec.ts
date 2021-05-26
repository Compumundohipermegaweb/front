/* tslint:disable:no-unused-variable */
import { HttpClient,HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsStockComponent } from './items-stock.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';


describe('ItemsStockComponent', () => {
  let component: ItemsStockComponent;
  let fixture: ComponentFixture<ItemsStockComponent>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [  ItemsStockComponent], 
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
    fixture = TestBed.createComponent(ItemsStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
