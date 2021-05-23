import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  apiHost = environment.apiHost;
  activeCardsUrl = "/api/cards/active"

  constructor(private http: HttpClient) { }

  getActiveCards(): Observable<ActiveCardsResponse> {
    return this.http.get<ActiveCardsResponse>(this.apiHost + this.activeCardsUrl);
  }
}

export interface ActiveCardsResponse {
  cards: CardResponse[];
}

export interface CardResponse {
  id: number;
  name: String;
  state: String;
}
