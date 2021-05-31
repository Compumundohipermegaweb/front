import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { BrandService } from '../service/brand.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {

  displayedColumns: String[]
  brandsDatasource: MatTableDataSource<Brand>

  constructor(
    private brandService: BrandService
  ) {
    this.displayedColumns = ["name", "actions"]
    this.initDataSource()
  }

  ngOnInit(): void {
  }

  initDataSource() {
    this.brandsDatasource = new MatTableDataSource()

    this.brandService.findAll()
      .subscribe(
        (response) => {
          this.brandsDatasource.data = response.brands
        },

        (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar las marcas disponibles"
          })
        }
      )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.brandsDatasource.filter = filterValue.trim().toLowerCase();
  }

  add() {

  }

  delete(brand: Brand) {

  }

  toggleEdit(brand: Brand) {

  }

  saveChanges(brand: Brand) {

  }

}

export interface Brand {
  id: number;
  name: String;
  editing?: Boolean;
}
