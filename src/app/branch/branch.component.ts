
import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { StringValueToken } from 'html2canvas/dist/types/css/syntax/tokenizer';
import { BranchResponse, BranchService } from '../service/branch.service'
import Swal from 'sweetalert2';
import { AddBranchDialogComponent } from '../add-branch-dialog/add-branch-dialog.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']

})

//export class BranchComponent implements AfterViewInit {
export class BranchComponent implements OnInit{


  
  dataSource = new MatTableDataSource<BranchResponse>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['codigo', 'domicilio', 'cp', 'telefono', 'mail', 'horarios'];

  constructor(private changeDetectorRefs: ChangeDetectorRef, private branchService: BranchService, private newBranch: MatDialog) {
    this.initDataSource();
  }

  ngOnInit(): void {

  }


  add(){
    const dialogRef = this.newBranch.open(AddBranchDialogComponent, { });

    dialogRef.afterClosed()
      .subscribe(
        (result: BranchResponse[]) => {
          if(result != null && result.length > 0) {
            result.forEach(element => {
              this.dataSource.data.push(element);
            });
            this.changeDetectorRefs.detectChanges();
          }
        }
      );
  }
  

  initDataSource() {
    this.dataSource = new MatTableDataSource()

    this.branchService.getAll()
      .subscribe(
        (response) => {
          this.dataSource.data = response.branches
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar las categorías"
          })
        }
      )
  }

}


export interface Branch {
  id: number;
  name: String;
  address: String;
  postal_code: String;
  email: String;
  contact_number: String;
  attetention_schedule: String;
}

export interface MyTableItem {
  telefono: string
  mail: string
  horarios: string
  codigo_postal: string
  domicilio: string
  codigo_sucursal: number;

}


