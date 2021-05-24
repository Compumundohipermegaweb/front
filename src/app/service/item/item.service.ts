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
  getAllUrl = "/api/items/all"

  constructor(private http: HttpClient) { }

  getMaster(): Observable<GetAllItemsResponse> {
    return this.http.get<GetAllItemsResponse>(this.host + this.getAllUrl);
  }
}

export interface GetAllItemsResponse {
  found_items: MasterItem[];
}
