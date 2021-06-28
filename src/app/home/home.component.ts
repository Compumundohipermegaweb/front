import { Component, OnInit } from '@angular/core';
import { Branch } from '../branch/branch.component';
import { StorageService } from '../login/core/storage.service';
import { BranchResponse, BranchService } from '../service/branch.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  branches: BranchResponse[]
  branchSelected: number

  constructor(private branchService: BranchService, private storageService: StorageService) { 
    this.fetchBranches()
  }

  ngOnInit(): void {
  }

  fetchBranches() {
    this.branches = []

    this.branchService.getAll()
      .subscribe(
        (response) => {
          this.branches = response.branches
          this.branchSelected = this.branches[0].id
          this.branchService.selectBranch(this.branchSelected)
        }
      )
  }

  selectBranch(branchId: number) {
    this.branchSelected = branchId
    this.branchService.selectBranch(this.branchSelected)
  }

  logout() {
    this.storageService.logout()
  }

}
