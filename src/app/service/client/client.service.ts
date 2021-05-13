import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  host = "http://localhost:8080"
  clientsUrl = "/api/clients"
  

  constructor(private http: HttpClient) { }

  getClient(name: string, document: string): Observable<ClientResponse[]> {
    const requestParams = new HttpParams().set("name", name).set("document", document);
    return this.http.get<ClientResponse[]>(this.host + this.clientsUrl, { params: requestParams });
  }

}


export interface GetClientsParameters {
  name?: string;
  document?: string;
}


export interface ClientResponse {
  document_number: String;
  first_name: String;
  last_name: String;
  state: String;
  credit_limit: number;
  email: String;
  contact_number: String;
}
