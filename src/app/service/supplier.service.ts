import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  host = environment.apiHost;
  supplierUrl = "/api/supplier";

  constructor(private http: HttpClient) { }

  createSupplier(postSupplierRequest: PostSupplierRequest): Observable<Supplier> {
    return this.http.post<Supplier>(this.host + this.supplierUrl, postSupplierRequest);
  }
}

export interface PostSupplierRequest{
  organization: String;
  contact_name: String;
  contact_number: String;
  email: String;
  cuit: String;
}

export interface Supplier{
  id: number,
  organization: String,
  contactName: String,
  contactNumber: String,
  email: String,
  cuit: String
}
