import { Component, OnInit } from '@angular/core';
import { RoleService } from '../service/role.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
  }

  isAllowed() {
    return this.roleService.isAdmin() || this.roleService.isManager()
  }

}
