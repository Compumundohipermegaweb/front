import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {


  host = environment.apiHost
  url = "/api/branches/{branch_id}/stock"

  constructor(private http: HttpClient) { }

  lookupStock(branchId: number, filters: GetStockFilters) {
    this.encodeUrl(branchId);
    let requestParams = new HttpParams()

    if(filters.category_id) {
      requestParams.append("category_id", filters.category_id.toString());
    }
    
    if(filters.description) {
      requestParams.append("description", filters.description.toString());
    }

    if(filters.brand_id) {
      requestParams.append("brand_id", filters.brand_id.toString());
    }

    if(filters.imported) {
      requestParams.append("imported", filters.imported.toString());
    }

    return this.http.get(this.host + this.url, { params: requestParams });
  }

  encodeUrl(branchId: number) {
    this.url = this.url.replace(/{branch_id}/gi, branchId.toString())
  }
}

export interface ItemLookupResponse {
  id: number;
  sku: number;
  short_description: String;
  long_description: String;
  brand_name: String;
  imported: Boolean;
  available_stock: number;
  unit_price: number;
}

export interface GetStockFilters {
  category_id?: String,
  description?: String,
  brand_id?: String,
  imported?: Boolean
}
