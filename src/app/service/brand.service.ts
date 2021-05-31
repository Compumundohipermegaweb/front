import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  delete(brandId: number) {
    return this.http.delete(this.host + this.baseUrl + "/" + brandId.toString())
  }

  create(brand: CreateBrandRequest): Observable<Brand> {
    let headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
    return this.http.post<Brand>(this.host + this.baseUrl, brand, {headers: headers})
  }

  update(brand: Brand): Observable<Brand> {
    return this.http.put<Brand>(this.host + this.baseUrl, brand)
  }
}

export interface FindAllBrandsResponse {
  brands: Brand[]
}

export interface CreateBrandRequest {
  name: String;
}
