import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from '../brands/brands.component';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private host = environment.apiHost
  private baseUrl = "/api/brands"

  constructor(private http: HttpClient) { }

  findAll(): Observable<FindAllBrandsResponse> {
    return this.http.get<FindAllBrandsResponse>(this.host + this.baseUrl)
  }
}

export interface FindAllBrandsResponse {
  brands: Brand[]
}
