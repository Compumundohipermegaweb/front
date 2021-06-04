import { Component, OnInit } from '@angular/core';
import { Branch } from '../branch/branch.component';
import { BranchService } from '../service/branch.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  branches: Branch[]

  constructor(private branchService: BranchService) { 
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
        }
      )
  }

}
