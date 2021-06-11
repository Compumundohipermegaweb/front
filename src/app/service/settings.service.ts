import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Alert } from 'src/app/settings/settings.component'

@Injectable({
  providedIn: 'root'
})

export class SettingsService {

  host = environment.apiHost
  configurationUrl = "/api/configurable";
  alertsUrl = "api/configurable/alerts"

  constructor(private http: HttpClient) { }

  getAllAlerts(): Observable<AlertResponse> {
    return this.http.get<AlertResponse>(this.host + this.alertsUrl);
  }

}

export interface AlertResponse{
  alerts: Alert[]
}


