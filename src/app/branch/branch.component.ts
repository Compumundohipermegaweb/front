
import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { StringValueToken } from 'html2canvas/dist/types/css/syntax/tokenizer';
import { BranchService } from '../service/branch.service'
import Swal from 'sweetalert2';



@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']

})

//export class BranchComponent implements AfterViewInit {
export class BranchComponent implements OnInit, AfterViewInit{


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MyTableItem>;
  dataSource = new MatTableDataSource<Branch>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['codigo', 'domicilio', 'cp', 'horarios', 'telefono', 'mail'];

  constructor(private changeDetectorRefs: ChangeDetectorRef, private branchService: BranchService) {
    this.initDataSource();
  }

  ngOnInit(): void {

  }



  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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


