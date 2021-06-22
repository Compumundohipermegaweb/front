import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  apiHost = environment.apiHost
  onlinevslocalUrl = "/api/report/ventas/onlinevslocal"
  rankingByBranchlUrl = "/api/report/ventasporsucursal"


  constructor(private http: HttpClient) { }

  getVentasOnlineVsLocal() {
    return this.http.get<OnlineVsLocalResponse>(this.apiHost + this.onlinevslocalUrl)
  }

  getRankingByBranch() {
    return this.http.get<RankingByBranchResponse>(this.apiHost + this.rankingByBranchlUrl)
  }
}

export interface OnlineVsLocalResponse{
  sales_type: Array<string>,
  sales_quantity: Array<number>,
  sales_amount: Array<number>
}


export interface RankingByBranchResponse{
  branches:BranchResponse[]
  sales_quantity: Array<number>
}

export interface BranchResponse{
  id: number,
  branch: string,
  address: string,
  postalCode: string,
  email: string,
  contactNumber: string,
  attentionSchedule: string
}
