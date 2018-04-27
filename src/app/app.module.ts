import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { UiModule } from "./ui/ui.module";
import { AppRoutingModule } from "./app-routing.module";
import { GeosportsService } from "./services/geosports.service";


@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    UiModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    GeosportsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
