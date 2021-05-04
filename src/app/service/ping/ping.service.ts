import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PingService {

  pingUrl = "https://pp1-hefesto-api-dev.herokuapp.com/api/ping"

  constructor(private http: HttpClient) { }

  pingApi() {
    return this.http.get<PingResponse>(this.pingUrl)
  }
}

export interface PingResponse {
  version: String;
}
