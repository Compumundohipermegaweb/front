import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PingService {

  apiHost = environment.apiHost
  pingUrl = "/api/ping"

  constructor(private http: HttpClient) { }

  pingApi() {
    return this.http.get<PingResponse>(this.apiHost + this.pingUrl)
  }
}

export interface PingResponse {
  version: String;
}
