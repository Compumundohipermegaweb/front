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
    {id: 1, short_description: "Martillo", long_description: "Martillo carpintero mango hickory", brand_name: "Redline", imported: false, available_stock: 999, unit_price: 1200},
    {id: 2, short_description: "Martillo", long_description: "Martillo mecanico", brand_name: "Redline", imported: false, available_stock: 999, unit_price: 1200},
    {id: 3, short_description: "Martillo", long_description: "Martillo galponero", brand_name: "Gardex", imported: true, available_stock: 999, unit_price: 1200},
    {id: 4, short_description: "Martillo", long_description: "Martillo carpintero fibra de vidrio 8 oz", brand_name: "Redline", imported: false, available_stock: 999, unit_price: 1200},
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
  short_description: String;
  long_description: String;
  brand_name: String;
  imported: Boolean;
  available_stock: number;
  unit_price: number;
}
