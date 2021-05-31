import {NgModule, Optional, SkipSelf} from '@angular/core';
import {fakeBackendProvider} from "./fake-backend";
import {StorageService} from "./storage.service";
import {AuthorizatedGuard} from "./authorizated.guard";

@NgModule({
  declarations: [  ],
  imports: [],
  providers: [
    StorageService,
    AuthorizatedGuard,
    fakeBackendProvider
  ],
  bootstrap: []
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
