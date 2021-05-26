import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stock } from 'src/app/items-stock/items-stock.component';
import Swal from 'sweetalert2';
import { StockToModifyRequest, IncreaseAllRequest, DecreaseAllRequest, StockService } from '../service/stock/stock.service';

@Component({
  selector: 'app-edit-stock-dialog',
  templateUrl: './edit-stock-dialog.component.html',
  styleUrls: ['./edit-stock-dialog.component.css'],
})
export class EditStockDialogComponent implements OnInit {

  
  selectControl: FormControl;
  quantityControl: FormControl;

  selectedItemStock: Stock;

  constructor(
    public dialogRef: MatDialogRef<EditStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Stock,
    private stockService: StockService,
  ) { 
    this.selectedItemStock = data
    this.selectControl = new FormControl();
    this.quantityControl = new FormControl();
  }


  ngOnInit(): void {
  }

  reduceStockItem(itemStockModified :DecreaseAllRequest){
    this.stockService.decreaseStock(itemStockModified,1)
    .subscribe(
      (response) => {
      
        Swal.fire({
          icon: "success",
          title: "¡Merma realizada!"
        });
      },

      (error) => {
        Swal.fire({
          icon: "error",
          title: "Fallo al actualizar",
          text: "No se pudo modificar el stock, revise los campos y vuelva a intentar. Si el error persiste contacte un administrador"
        });
      }
    );
  }

  increaseStockItem(itemStockModified :IncreaseAllRequest){
    this.stockService.increaseStock(itemStockModified,1)
    .subscribe(
      (response) => {
      
        Swal.fire({
          icon: "success",
          title: "¡Incremento realizado!"
        });
      },

      (error) => {
        Swal.fire({
          icon: "error",
          title: "Fallo al actualizar",
          text: "No se pudo modificar el stock, revise los campos y vuelva a intentar. Si el error persiste contacte un administrador"
        });
      }
    );

  }

  guardarCambios(stockItem:Stock){

    if(!(this.selectControl.value && this.quantityControl.value)){
      Swal.fire({
        icon: "warning",
        title: "Seleccione una opción y verifique que la cantidad sea correcta"
      });
    }else if ((this.quantityControl.value > stockItem.stock_total && this.selectControl.value ==1) 
              ||this.quantityControl.value < 0)
    {
      Swal.fire({
        icon: "warning",
        title: "La cantidad ingresada supera el stock o es incorrecta"
      });
    }else{

      let stockToModified: StockToModifyRequest = {
        amount : this.quantityControl.value,
        item_id : stockItem.id
      }

      let empList: Array<StockToModifyRequest> = [];

      empList.push(stockToModified); 

      if(this.selectControl.value=="1") {
        //Merma
        let decreaseAllRequest: DecreaseAllRequest = {
          modify_all : empList
        }
        this.reduceStockItem(decreaseAllRequest)
      } else {
          //Incremento
          let increaseAllRequest: IncreaseAllRequest = {
            modify_all : empList
        }

        this.increaseStockItem(increaseAllRequest)
      }
      this.close()

    }
    
      

    
  }

  close() {
    this.dialogRef.close()
  }

}
