import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MasterItem } from 'src/app/item-master/item-master.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  host = environment.apiHost;
  itemUrl = "/api/items";
  getAllUrl = "/api/items/all";

  constructor(private http: HttpClient) { }

  getMaster(): Observable<GetAllItemsResponse> {
    return this.http.get<GetAllItemsResponse>(this.host + this.getAllUrl);
  }

  createItem(postItemRequest: PostItemRequest): Observable<MasterItem> {
    return this.http.post<MasterItem>(this.host + this.itemUrl, postItemRequest);
  }

  deleteItem(sku: String): Observable<String>{
    return this.http.delete<String>(this.host + this.itemUrl + "/" + sku)
  }
}

export interface GetAllItemsResponse {
  found_items: MasterItem[];
}


export interface PostItemRequest {
  sku: String;
  short_description: String;
  description: String;
  brand_id: number;
  category_id: number;
  uom_sale: String;
  price: number;
  cost: number;
  imported: Boolean;
  state: String;
  supplier: SupplierRequest;
}

export interface SupplierRequest {
  organization: String;
  contact_name: String;
  contact_number: String;
  email: String;
  cuit: String;
}
