import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, HostListener } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';

import { PrintService } from '../print.service';
import { ChartService } from '../chart.service';
import { point } from '../point';

@Component({
  selector: 'app-span-graph',
  templateUrl: './span-graph.component.html',
  styleUrls: ['./span-graph.component.scss']
})
export class SpanGraphComponent implements OnChanges, OnInit {

  @Input() points: point[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['points'].isFirstChange()) {
      this.chartService.updateChart(this.chart, this.points);
    }
  };

  constructor(
    private printService: PrintService,
    private chartService: ChartService) { };

    public chart: Chart = null!;

  ngOnInit() {
    this.chart = this.chartService.createChart(this.points);
    this.chart.update();
  };

  // calls BehaviorSubject's next method, giving it a new value
  printGraph(): void {
    this.printService.getChart(this.chart);
  }
}
