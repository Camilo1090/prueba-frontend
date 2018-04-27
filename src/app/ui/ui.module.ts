import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatIconRegistry,
  MatIconModule,
  MatInputModule,
  MatTabsModule,
  MatButtonModule,
  MatRadioModule
} from "@angular/material";
import {
  CovalentCommonModule,
  CovalentLayoutModule,
  CovalentLoadingModule,
  CovalentMediaModule
} from "@covalent/core";


@NgModule({
  imports: [
    BrowserAnimationsModule,
    /** Material Modules */
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatRadioModule,
    /** Covalent Modules */
    CovalentCommonModule,
    CovalentLayoutModule,
    CovalentMediaModule,
    CovalentLoadingModule,
  ],
  exports: [
    BrowserAnimationsModule,
    /** Material Modules */
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    /** Covalent Modules */
    CovalentCommonModule,
    CovalentLayoutModule,
    CovalentMediaModule,
    CovalentLoadingModule
  ],
})
export class UiModule {
  constructor(matIconRegistry: MatIconRegistry) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}
