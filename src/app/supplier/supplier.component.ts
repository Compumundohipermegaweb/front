import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SupplierService } from '../service/supplier.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<MyTableSupplier>;

  dataSource = new MatTableDataSource<Supplier>();

  displayedColumns = ['id', 'nombre', 'telefono', 'email', 'cuit'];

  constructor(private changeDetectorRefs: ChangeDetectorRef, supplierService: SupplierService) {
    this.initDataSource();
  }

  initDataSource() {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  nuevoProveedor(){
    
  }

}

export interface Supplier{
  id: number,
  organization: String,
  contactName: String,
  contactNumber: String,
  email: String,
  cuit: String
}

export interface MyTableSupplier{
  id: number;
  nombre: String;
  telefono: number;
  email: String;
  cuit: number;
}
