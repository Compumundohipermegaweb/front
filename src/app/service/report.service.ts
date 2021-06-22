import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  apiHost = environment.apiHost
  onlinevslocalUrl = "/api/report/ventas/onlinevslocal"

  constructor(private http: HttpClient) { }

  getVentasOnlineVsLocal() {
    return this.http.get<OnlineVsLocalResponse>(this.apiHost + this.onlinevslocalUrl)
  }
}

export interface OnlineVsLocalResponse{
  sales_type: Array<string>,
  sales_quantity: Array<number>,
  sales_amount: Array<number>
}


