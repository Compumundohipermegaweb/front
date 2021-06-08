import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {LoginObject} from "./login-object.model";
import {Session} from "../core/session.model";
import {HttpClient} from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
   providedIn: 'root'
})
export class AuthenticationService {

  private HOST = environment.apiHost
  private BASE_URL = '/api/authentication';
  private LOGIN_URL = "/login";
  private LOGOUT_URL = "/logout"

  constructor(private http: HttpClient) {}

  login(loginObj: LoginObject): Observable<Session> {
    return this.http.post<Session>(this.HOST + this.BASE_URL + this.LOGIN_URL, loginObj);
  }

  logout(): Observable<Boolean> {
    return this.http.post<Boolean>(this.HOST + this.BASE_URL + this.LOGOUT_URL, {});
  }
}
