import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MeasurementUnitsComponent } from 'src/app/measurement-units/measurement-units.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private host = environment.apiHost
  private baseUrl = "/api/unit"

  constructor(private http: HttpClient) { }

  create() {

  }

  findAll() {

  }

  delete() {

  }

  save() {

  }
}
