import { Component } from '@angular/core';
import { SpanGraphComponent } from '../span-graph/span-graph.component';
import { PrintService } from '../print.service';

@Component({
  selector: 'app-graph-print',
  templateUrl: './graph-print.component.html',
  styleUrls: ['./graph-print.component.scss'],
  providers: [SpanGraphComponent]
})
export class GraphPrintComponent {
  constructor(
    public printService: PrintService) {
  }
}
