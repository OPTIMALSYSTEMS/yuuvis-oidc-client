import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { YuvFrameworkModule } from '@yuuvis/framework';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    YuvFrameworkModule.forRoot({
      // oidc: {
      //   host: 'https://kolibri.enaioci.net',
      //   tenant: 'kolibri',
      //   issuer: 'https://kc001.auth.enaioci.net/auth/realms/kolibri',
      //   clientId: 'spa-client',
      // },
      oidc: JSON.parse(localStorage.getItem(AppComponent.OIDC) || '{}'),
      translations: ['assets/default/i18n/', 'assets/@yuuvis/i18n/']})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
