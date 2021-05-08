import { TestBed } from '@angular/core/testing';

import { SalesService } from './sales.service';
import { HttpClient, HttpHandler } from '@angular/common/http'

describe('SalesService', () => {
  let service: SalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ HttpClient, HttpHandler ]
    });
    service = TestBed.inject(SalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
