import { Component, ElementRef, ViewChild, OnDestroy, Input } from '@angular/core';
import { SpanGraphComponent } from '../span-graph/span-graph.component';
import { PrintService } from '../print.service';
import { ChartService } from '../chart.service';
import { chartData } from '../point';

@Component({
  selector: 'app-graph-print',
  templateUrl: './graph-print.component.html',
  styleUrls: ['./graph-print.component.scss'],
  providers: [SpanGraphComponent]
})
export class GraphPrintComponent implements OnDestroy {
  @Input() chartData: chartData = {points: [{x: 0, y: 0}], unitsX: '', unitsY: '', calcPoint: null};
  @ViewChild('chartCopy') 
  canvas!: ElementRef<HTMLCanvasElement>;

  displayedCols: string[] = ['Input', 'Output'];

  constructor(
    public printService: PrintService,
    public chartService: ChartService,
  )  {
    // Recieves HTMLCanvasElement data sent by span-graph.component
    this.printService.graphData$.subscribe(data => {
      if (data) {
        this.onPrintGraph(data);
      }
    })
  };

  onPrintGraph(canvasOriginal: HTMLCanvasElement){
    this.printService.printGraph(this.canvas.nativeElement, canvasOriginal);
  };

  ngOnDestroy(): void {
      
  }

}
