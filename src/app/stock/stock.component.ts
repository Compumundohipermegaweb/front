import { Component, OnInit } from '@angular/core';
import { RoleService } from '../service/role.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})

export class StockComponent implements OnInit  {

  constructor(private roleService: RoleService){
  }
  
  ngOnInit(): void {
  }

  isAllowed() {
    return this.roleService.isAdmin() || this.roleService.isManager() || this.roleService.isSupervisor()
  }

}

