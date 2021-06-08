import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Role } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class CashierGuard implements CanActivate {

  constructor(private storageService: StorageService) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let token = this.storageService.getCurrentToken()

    if(token && token.role == Role.CAJERO) {
      return true
    } else {
      return false
    }
  }
  
}
