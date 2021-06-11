import { Injectable } from '@angular/core';
import { StorageService } from '../login/core/storage.service';
import { Role } from '../login/core/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private storageService: StorageService) { }


  isSalesman() {
    let token = this.storageService.getCurrentToken()

    return token && token.role == Role.VENDEDOR
  }

  isCashier() {
    let token = this.storageService.getCurrentToken()

    return token && token.role == Role.CAJERO
  }

  isSupervisor() {
    let token = this.storageService.getCurrentToken()

    return token && token.role == Role.SUPERVISOR
  }

  isManager() {
    let token = this.storageService.getCurrentToken()

    return token && token.role == Role.GERENTE
  }

  isAdmin() {
    let token = this.storageService.getCurrentToken()

    return token && token.role == Role.ADMIN
  }
}
