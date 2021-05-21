import { CurrencyPipe } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { LocalCurrencyPipe } from "./local-currency.pipe";


describe('LocalCurrencyPipe', () => {
    let currencyPipe: CurrencyPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CurrencyPipe
            ]
        })
        currencyPipe = TestBed.inject(CurrencyPipe);
    });

    it('create an instance', () => {
      const pipe = new LocalCurrencyPipe(currencyPipe);

      expect(pipe).toBeTruthy();
    });

});