import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../print.service';

import { SpanGraphComponent } from '../span-graph/span-graph.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graph-print',
  templateUrl: './graph-print.component.html',
  styleUrls: ['./graph-print.component.scss'],
  providers: [SpanGraphComponent]
})
export class GraphPrintComponent implements OnInit {
  chart?: Chart;

  // The data varaible will include: chartjs graph, input: lrv, urv, output: lrv, urv
  constructor(
    route: ActivatedRoute,
    private printService: PrintService,
    private spanGraphComponent: SpanGraphComponent) {
    //this.data = route.snapshot.params['data'];
  }

  ngOnInit(): void {
    this.printService.graphData$.subscribe(chart => this.chart = chart!)

    
  }

}
