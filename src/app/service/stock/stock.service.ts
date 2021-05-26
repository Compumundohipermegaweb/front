import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Stock } from 'src/app/items-stock/items-stock.component';
import { BooleanInput } from '@angular/cdk/coercion';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  host = environment.apiHost
  stockLooupUrl = "/api/branches/{branch_id}/stock"
  stockValidationUrl = "/api/branches/{branch_id}/stock/{sku}"
  getAllstockUrl = "/api/branches/{branch_id}/stock/all"
  reduceStockUrl = "/api/stock/reduce-all?branch_id={branch_id}"
  increaseStockUrl = "/api/stock/increase-all?branch_id={branch_id}"

  constructor(private http: HttpClient) { }

  lookupStock(branchId: number, filters: GetStockFilters): Observable<ItemLookupResponse> {
    let requestParams = new HttpParams()

    if(filters.category_id) {
      requestParams = requestParams.append("category_id", filters.category_id.toString());
    }
    
    if(filters.description) {
      requestParams = requestParams.append("description", filters.description.toString());
    }

    if(filters.brand_id) {
      requestParams = requestParams.append("brand_id", filters.brand_id.toString());
    }

    if(filters.imported) {
      requestParams = requestParams.append("imported", filters.imported.toString());
    }

    return this.http.get<ItemLookupResponse>(this.host + this.buildStockLookupUrl(branchId), { params: requestParams });
  }

  validateStock(request: StockValidationRequest): Observable<StockValidationResponse> {
    return this.http.get<StockValidationResponse>(this.host + this.buildStockValidationUrl(request) )
  }

  buildStockLookupUrl(branchId: number) {
    return this.stockLooupUrl.replace(/{branch_id}/gi, branchId.toString())
  }

  buildStockValidationUrl(request: StockValidationRequest) {
    return this.stockValidationUrl
                  .replace(/{branch_id}/gi, request.branchId.toString())
                  .replace(/{sku}/gi, request.sku.toString())
  }

  buildStockAllUrl(branchId: number) {
    return this.getAllstockUrl.replace(/{branch_id}/gi, branchId.toString())
  }
  
  buildIncreaseStockUrl(branchId: number) {
    return this.increaseStockUrl.replace(/{branch_id}/gi, branchId.toString())
  }

  buildReduceStockUrl(branchId: number) {
    return this.reduceStockUrl.replace(/{branch_id}/gi, branchId.toString())
  }


  getStock(branchId: number): Observable<GetAllStockResponse> {
    return this.http.get<GetAllStockResponse>(this.host + this.buildStockAllUrl(branchId));
  }

  
  // reduceStock(stockToModifyRequest: StockToModifyRequest,branchId: number): Observable<ReduceAll> {
  //   return this.http.post<>(this.host + this.buildReduceStockUrl(branchId));
  // }


}

export interface GetAllStockResponse {
  stocks: Stock[];
}

export interface ItemLookupResponse {
  items: ItemStockResponse[]
}

export interface ItemStockResponse {
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

export interface StockValidationRequest {
  branchId: number;
  sku: number;
}

export interface StockValidationResponse {
  sku: number;
  available_stock: number;
}

export interface StockToModifyRequest{
  item_id: number,
  amount: number
}
export interface ReduceAll {
  modify_all: StockToModifyRequest[];
}

export interface increaseAll {
  modify_all: StockToModifyRequest[];
}

