import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter, SimpleChange, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ChartService } from '../chart.service';
import { PrintService } from '../print.service';
import { chartData } from '../point';

export interface canvasData {
  element: HTMLCanvasElement,
  w: number,
  h: number,
  dw: number,
  dh: number,
}

@Component({
  selector: 'app-span-graph',
  templateUrl: './span-graph.component.html',
  styleUrls: ['./span-graph.component.scss']
})
export class SpanGraphComponent implements OnChanges, OnInit {
  @Input() chartData: chartData = {points: [{x: 0, y: 0}], unitsX: '', unitsY: '', calcPoint: null};
  @Input() isDarkTheme: boolean = false;
  
  @ViewChild('chart')
  canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;

  public chart: Chart = null!;
  
  constructor(
    private chartService: ChartService,
    private printService: PrintService) {
      this.printService.graphData$.subscribe(data => {
        if (!data){
          this.printService.sendData(this.canvas.nativeElement);
        }
      })
    };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartData'] && !changes['chartData'].isFirstChange()) {
      this.chartService.updateChart(this.chart, this.chartData!, this.isDarkTheme);
    }
  };

  ngOnInit() {
    this.chart = this.chartService.createChart(this.chartData!.points, this.isDarkTheme);
    this.chart.update();
  };

}