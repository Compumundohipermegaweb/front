import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Dispatch } from '../dispatches/dispatches.component';

@Injectable({
  providedIn: 'root'
})
export class DispatchService {

  private HOST = environment.apiHost
  private BASE_URL = "/api/dispatches"
  private CONFIRM_URL = "/{id}/confirm"

  constructor(private http: HttpClient) { }

  getAll(): Observable<GetAllDispatchesResponse> {
    return this.http.get<GetAllDispatchesResponse>(this.HOST + this.BASE_URL)
  }

  confirm(dispatchId: number, total: number, branchId: number) {
    return this.http.post(this.HOST + this.BASE_URL + this.buildConfirmUrl(dispatchId), {total_cost: total, branch_id: branchId})
  }

  private buildConfirmUrl(dispatchId: number): String {
    return this.CONFIRM_URL.replace("{id}", dispatchId.toString())
  }
}

export interface GetAllDispatchesResponse {
  dispatches: Dispatch[]
}
