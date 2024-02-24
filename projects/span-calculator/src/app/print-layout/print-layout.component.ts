import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { chartData } from '../point';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.scss']
})
export class PrintLayoutComponent implements OnInit {
  @Input() chartData: chartData = {points: [{x: 0, y: 0}], unitsX: '', unitsY: '', calcPoint: null};

  constructor() {}

  ngOnInit(): void {}
  

}
  