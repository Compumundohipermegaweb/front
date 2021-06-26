import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Brand } from '../brands/brands.component';
import { Category } from '../categories/categories.component';
import { BrandService } from '../service/brand.service';
import { CategoryService } from '../service/category.service';
import { GetStockFilters, ItemLookupResponse, ItemStockResponse, StockService } from '../service/stock.service';

@Component({
  selector: 'app-item-lookup-dialog',
  templateUrl: './item-lookup-dialog.component.html',
  styleUrls: ['./item-lookup-dialog.component.css']
})
export class ItemLookupDialogComponent implements OnInit {

  searchingItems: Boolean = false;
  hasSearched: Boolean = false;

  foundItems: ItemStockResponse[] = [];

  branchIdControl: FormControl;
  itemCategoryControl: FormControl;
  itemDescriptionControl: FormControl;
  itemBrandControl: FormControl;
  importedControl: FormControl;

  filtersForm: FormGroup;

  categories: Category[]
  brands: Brand[]

  constructor(
    public dialogRef: MatDialogRef<ItemLookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemsStockLookupData,
    private formBuilder: FormBuilder,
    private stockService: StockService,
    private categoryService: CategoryService,
    private brandService: BrandService) {
      
      this.branchIdControl = new FormControl(data.branchId);
      this.branchIdControl.disable()
      this.itemCategoryControl = new FormControl("");
      this.itemDescriptionControl = new FormControl("");
      this.itemBrandControl = new FormControl("");
      this.importedControl = new FormControl(false);

      this.filtersForm = formBuilder.group({
        branchId: this.branchIdControl,
        category: this.itemCategoryControl,
        description: this.itemDescriptionControl,
        brand: this.itemBrandControl,
        imported: this.importedControl
      });

      this.categoryService.findAll().subscribe(
          (respose) => {
            if(respose.categories) {
              this.categories = respose.categories
            } else {
              this.categories = []
            }
          },

          (error) => {
            this.categories = []
          }
        )
      
      this.brandService.findAll().subscribe(
          (response) => {
            if(response.brands) {
              this.brands = response.brands
            } else {
              this.brands = []
            }
          },

          (error) => {
            this.brands = []
          }
        )
    
    }

  ngOnInit(): void {
  }

  lookupItems() {
    if(this.branchIdControl.invalid) {
      return;
    }
    
    this.searchingItems = true;
    let filters: GetStockFilters = {
      category_id: this.itemCategoryControl.value,
      description: this.itemDescriptionControl.value,
      brand_id: this.itemBrandControl.value,
      imported: this.importedControl.value
    }

    this.stockService.lookupStock(this.branchIdControl.value, filters).subscribe(
      (response: ItemLookupResponse) => {
        this.searchingItems = false;
        this.foundItems = response.items
        this.hasSearched = true;
      },

      (error) => {
        this.searchingItems = false;
      }
    );
  }

  selectItem(item: ItemLookupResponse) {
    this.dialogRef.close(item)
  }

}

export interface ItemsStockLookupData {
  branchId?: number
}
