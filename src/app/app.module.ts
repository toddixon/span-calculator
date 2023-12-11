import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
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

import { NgChartsModule } from 'ng2-charts';
import { SpanGraphComponent } from './span-graph/span-graph.component';

@NgModule({
  declarations: [
    AppComponent,
    SpanGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    FormsModule,
    ReactiveFormsModule,

    MatSliderModule, 
    MatToolbarModule, 
    MatButtonModule, 
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
