import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    private brandService: BrandService,
    private changeDetectorRef: ChangeDetectorRef
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
    
    Swal.fire({
      icon: "question",
      title: "Seguro desea eliminar",
      text: brand.name.toString(),
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      confirmButtonColor: "#3f51b5",
      cancelButtonText: "Cancelar",
      cancelButtonColor: "#f44336"
    }).then((result) => {
      if(result.isConfirmed) {
        this.brandService.delete(brand.id)
          .subscribe(
            (response) => {
              Swal.fire({
                icon: "success",
                title: "Item eliminado!",
                text: "Se ha eliminado " + brand.name
              });

              this.brandsDatasource.data = this.brandsDatasource.data.filter((it) => it.id != brand.id)
              this.changeDetectorRef.detectChanges()
            },

            (error) => {
              Swal.fire({
                icon: "error",
                title: "No se pudo eliminar",
                text: "Intentelo nuevamente, si el error persiste contacte un administrador"
              })
            }
          )
      }
    })
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
