import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { StockService } from './stock.service';

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

  it("should format the url", () => {
    let branchId = 1234;
    service.encodeUrl(branchId)

    expect(service.url).toEqual("/api/branches/1234/stock")
  });
  
});
