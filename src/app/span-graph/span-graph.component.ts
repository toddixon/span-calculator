import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';


import { ChartService } from '../chart.service';
import { chartData } from '../point';

@Component({
  selector: 'app-span-graph',
  templateUrl: './span-graph.component.html',
  styleUrls: ['./span-graph.component.scss']
})
export class SpanGraphComponent implements OnChanges, OnInit {
  @Input() chartData: chartData = {points: [{x: 0, y: 0}], unitsX: '', unitsY: '', calcPoint: null};
  public chart: Chart = null!;

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['chartData'].isFirstChange()) {
      this.chartService.updateChart(this.chart, this.chartData!);
    };
  };
  
  constructor(
    private chartService: ChartService) {};

  ngOnInit() {
    this.chart = this.chartService.createChart(this.chartData!.points);
    this.chart.update();
  };
}