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

  newBranch(branch: PostBranchRequest): Observable<BranchResponse> {
    return this.http.post<BranchResponse>(this.HOST + this.BASE_URL, branch)
  }
}

export interface GetAllBranchesResponse {
  branches: BranchResponse[]
}

export interface PostBranchRequest{
  id?: number;
  branch: String;
  address: String;
  postal_code: String;
  email: String;
  contact_number: String;
  attention_schedule: String;
}

export interface BranchResponse{
  id: number;
  branch: String;
  address: String;
  postalCode: String;
  email: String;
  contactNumber: String;
  attentionSchedule: String;
}
