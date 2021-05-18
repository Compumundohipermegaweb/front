import { CurrencyPipe, Location } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalCurrencyPipe } from '../pipe/local-currency.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { registerLocaleData } from '@angular/common';
import localEsAr from "@angular/common/locales/es-AR";
registerLocaleData(localEsAr)

import { ItemLookupDialogComponent } from './item-lookup-dialog.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ItemLookupDialogComponent', () => {
  let location: Location;
  let component: ItemLookupDialogComponent;
  let fixture: ComponentFixture<ItemLookupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemLookupDialogComponent, LocalCurrencyPipe ],
      imports: [
        MatDialogModule, 
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatDividerModule,
        MatListModule,
        BrowserAnimationsModule,
        MatCheckboxModule
      ],
      providers: [
        CurrencyPipe,
        HttpClient,
        HttpHandler,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
        { provide: LOCALE_ID, useValue: 'es-AR' }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(ItemLookupDialogComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
