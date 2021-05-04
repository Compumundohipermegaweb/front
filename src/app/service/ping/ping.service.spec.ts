import { TestBed } from '@angular/core/testing';

import { PingService } from './ping.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from "@angular/common/http"

describe('PingService', () => {
  let service: PingService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [HttpClient, HttpHandler]});
    service = TestBed.inject(PingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
