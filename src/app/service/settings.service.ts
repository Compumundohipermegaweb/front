import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Alert } from 'src/app/settings/settings.component'

@Injectable({
  providedIn: 'root'
})

export class SettingsService {

  private host = environment.apiHost
  private baseUrl = "/api/alerts";

  constructor(private http: HttpClient) { }

  getAllAlerts(): Observable<AlertResponse> {
    return this.http.get<AlertResponse>(this.host + this.baseUrl);
  }

  updateAlert(alerta: Alert): Observable<Alert>{
    return this.http.put<Alert>(this.host + this.baseUrl, {id: alerta.id, time: alerta.time, alert_description: alerta.alert_description});
  }

}

export interface AlertResponse{
  alerts: Alert[]
}


