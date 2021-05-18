import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { StockService, StockValidationRequest } from './stock.service';

describe('StockService', () => {
  let service: StockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient, 
        HttpHandler
      ]
    });
    service = TestBed.inject(StockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should build stock lookup url", () => {
    let branchId = 1234;

    expect(service.buildStockLookupUrl(branchId)).toEqual("/api/branches/1234/stock")
  });

  it("should build stock validation url", () => {
    let request: StockValidationRequest = {
      branchId: 1,
      sku: 12351231
    }

    expect(service.buildStockValidationUrl(request)).toEqual("/api/branches/1/stock/12351231")
  });
  
});
