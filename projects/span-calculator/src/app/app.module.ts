import { NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

import { PrintService } from './print.service';
import { NgChartsModule } from 'ng2-charts';
import { SpanGraphComponent } from './span-graph/span-graph.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';
import { GraphPrintComponent } from './graph-print/graph-print.component';
import { SpanResultComponent } from './span-result/span-result.component';
import { FooterComponent } from './footer/footer.component';
import { SetMaxHeightDirective } from './set-max-height.directive';
import { NumericInputFieldValidationDirective } from './numeric-input-field-validation.directive';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    SpanGraphComponent,
    PrintLayoutComponent,
    GraphPrintComponent,
    SpanResultComponent,
    FooterComponent,
    SetMaxHeightDirective,
    NumericInputFieldValidationDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    MatSliderModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatTabsModule,
    MatIconModule, 
    MatFormFieldModule, 
    MatGridListModule, 
    MatListModule, 
    MatTooltipModule, 
    MatTableModule, 
    MatCheckboxModule, 
    MatRadioModule, 
    MatProgressSpinnerModule, 
    MatInputModule,
    MatCardModule,
    MatSelectModule,

    NgChartsModule,
  ],
  providers: [PrintService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
