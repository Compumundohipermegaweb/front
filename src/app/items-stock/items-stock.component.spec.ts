/* tslint:disable:no-unused-variable */
import { HttpClient,HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsStockComponent } from './items-stock.component';

describe('ItemsStockComponent', () => {
  let component: ItemsStockComponent;
  let fixture: ComponentFixture<ItemsStockComponent>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsStockComponent ],
        providers: [HttpClient, HttpHandler]
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
