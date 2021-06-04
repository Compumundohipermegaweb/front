import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Branch } from '../branch/branch.component';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private HOST = environment.apiHost
  private BASE_URL = "/api/branches"

  selectedBranch: number

  constructor(private http: HttpClient) { }

  getAll(): Observable<GetAllBranchesResponse> {
    return this.http.get<GetAllBranchesResponse>(this.HOST + this.BASE_URL)
  }

  selectBranch(branchId: number) {
    this.selectedBranch = branchId
  }
}

export interface GetAllBranchesResponse {
  branches: Branch[]
}
