import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {LoginObject} from "./login-object.model";
import {Session} from "../core/session.model";
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
/**
 * Created by xavi on 5/16/17.
 */
@Injectable({
   providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  /*private host = environment.apiHost*/
  private basePath = '/api/authenticate/';

  login(loginObj: LoginObject): Observable<Session> {
    return this.http.post<Session>(/*this.host +*/ this.basePath + 'login', loginObj);
  }

  logout(): Observable<Boolean> {
    return this.http.post<Boolean>(/*this.host +*/ this.basePath + 'logout', {});
  }
}
