import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Brand } from '../brands/brands.component';
import { Category } from '../categories/categories.component';
import { MasterItem } from '../item-master/item-master.component';
import { BrandService } from '../service/brand.service';
import { CategoryService } from '../service/category.service';
import { ItemService, PostItemRequest } from '../service/item.service';
import { MeasurementUnit } from 'src/app/measurement-units/measurement-units.component';
import { UnitService } from '../service/unit.service';

@Component({
  selector: 'app-new-item-dialog',
  templateUrl: './new-item-dialog.component.html',
  styleUrls: ['./new-item-dialog.component.css']
})
export class NewItemDialogComponent implements OnInit {

  creatingItem = false;

  brands: Brand[]
  categories: Category[]
  measurementUnits: MeasurementUnit[]

  itemForm: FormGroup;

  skuControl: FormControl;
  shortDescriptionControl: FormControl;
  longDescriptionControl: FormControl;
  brandControl: FormControl;
  categoryControl: FormControl;
  uomControl: FormControl;
  priceControl: FormControl;
  costControl: FormControl;
  importedControl: FormControl;
  stateControl: FormControl;
  supplierControl: FormControl;
  contactNameControl: FormControl;
  contactPhoneControl: FormControl;
  emailControl: FormControl;
  cuitControl: FormControl;

  createdItems: MasterItem[];

  constructor(
    public dialogRef: MatDialogRef<NewItemDialogComponent>, 
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private measurementUnitService: UnitService
  ) { 
    this.createdItems = [];
    this.fetchBrands()
    this.fetchCategories()
    this.fetchMeasurementUnits()

    this.skuControl = new FormControl();
    this.shortDescriptionControl = new FormControl();
    this.longDescriptionControl = new FormControl();
    this.brandControl = new FormControl();
    this.categoryControl = new FormControl();
    this.uomControl = new FormControl();
    this.priceControl = new FormControl();
    this.costControl = new FormControl();
    this.importedControl = new FormControl();
    this.stateControl = new FormControl();
    this.supplierControl = new FormControl();
    this.contactNameControl = new FormControl();
    this.contactPhoneControl = new FormControl();
    this.emailControl = new FormControl();
    this.cuitControl = new FormControl();

    this.itemForm = formBuilder.group({
      sku: this.skuControl,
      shortDescription: this.shortDescriptionControl,
      longDescription: this.longDescriptionControl,
      brand: this.brandControl,
      category: this.categoryControl,
      uom: this.uomControl,
      price: this.priceControl,
      cost: this.costControl,
      imported: this.importedControl,
      state: this.stateControl,
      supplier: this.supplierControl,
      contactName: this.contactNameControl,
      contactPhone: this.contactPhoneControl,
      email: this.emailControl,
      cuit: this.cuitControl
    });

    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
  }

  fetchBrands() {
    this.brands = []

    this.brandService.findAll()
      .subscribe(
        (response) => {
          this.brands = response.brands
        }
      )
  }

  fetchCategories() {
    this.categories = []

    this.categoryService.findAll()
      .subscribe(
        (response) => {
          this.categories = response.categories
        }
      )
  }

  fetchMeasurementUnits() {
    this.measurementUnits = []

    this.measurementUnitService.findAll()
      .subscribe(
        (response) => {
          this.measurementUnits = response.units
        }
      )
  }

  createItem() {
    this.creatingItem = true;

    if(this.itemForm.invalid) {
      this.creatingItem = false;
      return;
    }

    let item: PostItemRequest = {
      sku: this.skuControl.value,
      short_description: this.shortDescriptionControl.value,
      description: this.longDescriptionControl.value,
      brand_id: this.brandControl.value,
      category_id: this.categoryControl.value,
      uom_sale: this.uomControl.value,
      price: this.priceControl.value,
      cost: this.costControl.value,
      imported: this.importedControl.value,
      state: this.getState(),
      supplier: {
        organization: this.supplierControl.value,
        contact_name: this.contactNameControl.value,
        contact_number: this.contactPhoneControl.value,
        email: this.emailControl.value,
        cuit: this.cuitControl.value
      }
    }

    this.itemService.createItem(item)
      .subscribe(
        (response) => {
          this.creatingItem = false;
          Swal.fire({
            icon: "success",
            title: "¡Item creado!"
          });

          this.createdItems.push(response);
          console.log("Items creados = " + this.createdItems.length)
        },

        (error) => {
          this.creatingItem = false;
          Swal.fire({
            icon: "error",
            title: "Fallo al crear el item",
            text: "No se pudo crear el item, revise los campos y vuelva a intentar. Si el error persiste contacte un administrador"
          });
        }
      );

  }

  private getState() {
    if(this.stateControl.value) {
      return "ACTIVO";
    } else {
      return "INACTIVO";
    }
  }

  close() {
    this.dialogRef.close(this.createdItems)
  }

}
