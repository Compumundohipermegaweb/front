import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-item-lookup-dialog',
  templateUrl: './item-lookup-dialog.component.html',
  styleUrls: ['./item-lookup-dialog.component.css']
})
export class ItemLookupDialogComponent implements OnInit {

  foundItems: ItemLookupResponse[] = [
    {id: 1, sku: 1, shortDescription: "Martillo", longDescription: "Martillo carpintero mango hickory", category:  "Herramientas", brand: "Redline", imported: false, stock: 999, price: 1200},
    {id: 2, sku: 2, shortDescription: "Martillo", longDescription: "Martillo mecanico", category:  "Herramientas", brand: "Redline", imported: false, stock: 999, price: 1200},
    {id: 3, sku: 3, shortDescription: "Martillo", longDescription: "Martillo galponero", category:  "Herramientas", brand: "Gardex", imported: true, stock: 999, price: 1200},
    {id: 4, sku: 4, shortDescription: "Martillo", longDescription: "Martillo carpintero fibra de vidrio 8 oz", category:  "Herramientass", brand: "Redline", imported: false, stock: 999, price: 1200},
  ]

  itemCategoryControl: FormControl;
  itemDescriptionControl: FormControl;
  itemBrandControl: FormControl;
  importedControl: FormControl;

  filtersForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ItemLookupDialogComponent>,
    private formBuilder: FormBuilder) {
      this.itemCategoryControl = new FormControl("");
      this.itemDescriptionControl = new FormControl("");
      this.itemBrandControl = new FormControl("");
      this.importedControl = new FormControl(false);

      this.filtersForm = formBuilder.group({
        category: this.itemCategoryControl,
        description: this.itemDescriptionControl,
        brand: this.itemBrandControl,
        imported: this.importedControl
      });
    }

  ngOnInit(): void {
  }

  selectItem(item: ItemLookupResponse) {
    this.dialogRef.close(item)
  }

}

export interface ItemLookupResponse {
  id: number;
  sku: number;
  shortDescription: String;
  longDescription: String;
  category: String;
  brand: String;
  imported: Boolean;
  stock: number;
  price: number;
}
