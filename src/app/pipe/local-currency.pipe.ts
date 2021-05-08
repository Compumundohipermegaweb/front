import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

/*
 * Formatea un valor de la manera que anotamos los precios en Argentina.
 * Por ejemplo: 
 * Dado valor = 6899.55 retorna $6.899,55
*/
@Pipe({name: 'localCurrency'})
export class LocalCurrencyPipe implements PipeTransform {

    constructor(private currencyPipe: CurrencyPipe) {}

    transform(value: string | number): String {
        return this.currencyPipe.transform(value, "ARS", "symbol-narrow", "1.2-2", "es-AR")
    }
}