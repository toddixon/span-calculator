import { Component, Input } from '@angular/core';
import { chartData } from '../point';
import { MatTabChangeEvent } from '@angular/material/tabs';


@Component({
  selector: 'app-span-result',
  templateUrl: './span-result.component.html',
  styleUrls: ['./span-result.component.scss']
})
export class SpanResultComponent {
  @Input() chartData: chartData = {points: [{x: 0, y: 0}], unitsX: '', unitsY: '', calcPoint: null};
  displayedCols: string[] = ['Input', 'Output'];
  onTabChange(event: MatTabChangeEvent) {

  }
  

};
