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
      translations: ['assets/default/i18n/', 'assets/@yuuvis/i18n/']}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
