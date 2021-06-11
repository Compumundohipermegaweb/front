import { Component, OnInit } from '@angular/core';
import { RoleService } from '../service/role.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
  }

  isSalesman() {
    return this.roleService.isSalesman()
  }

  isCashier() {
    return this.roleService.isCashier()
  }

  isSupervisor() {
    return this.roleService.isSupervisor()
  }

  isManager() {
    return this.roleService.isManager()
  }

  isAdmin() {
    return this.roleService.isAdmin()
  }



}
