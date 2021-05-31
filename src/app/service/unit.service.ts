import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from 'src/app/measurement-units/measurement-units.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private host = environment.apiHost
  private baseUrl = "/api/unit"

  constructor(private http: HttpClient) { }

  create(unit: CreateUnitRequest):  Observable<Unit> {
    return this.http.post<Unit>(this.host + this.baseUrl, unit)
  }

  findAll(): Observable<FindAllUnitResponse> {
    return this.http.get<FindAllUnitResponse>(this.host + this.baseUrl)
  }

  delete(unitId: number) {
    return this.http.delete(this.host + this.baseUrl + "/" + unitId.toString())
  }

  save(unit: Unit): Observable<Unit> {
    return this.http.put<Unit>(this.host + this.baseUrl, unit)
  }
}

export interface CreateUnitRequest {
  name: String;
  description: String;
}

export interface FindAllUnitResponse {
  units: Unit[]
}
