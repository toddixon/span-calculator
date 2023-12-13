import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';

import { point } from '../point';

@Component({
  selector: 'app-span-graph',
  templateUrl: './span-graph.component.html',
  styleUrls: ['./span-graph.component.scss']
})
export class SpanGraphComponent implements OnChanges, OnInit {

  @Input() points: point[] = [
    {x: 0, y: 0}, {x: 1, y: 1}, 
    {x: 2, y: 2}, {x: 3, y: 3}, 
    {x: 4, y: 4}, {x: 4, y: 4},
    {x: 6, y: 6}, {x: 7, y: 7}, 
    {x: 8, y: 8}, {x: 9, y: 9},
  ];
  ngOnChanges(changes: SimpleChanges){
    
    if(!changes['points'].isFirstChange()){
      this.updateChart();
    }
  };

  private updateChart() {
    let chart = this.chart;

    this.removeData(chart);

    let chartDataSet: ChartData<'line', point[]> = {
      datasets:[{ 
        data: this.points,
        parsing: {
          xAxisKey: 'x',
          yAxisKey: 'y',
        },
      }]
    };
    this.addData(chart, chartDataSet);

    this.setOptions(chart);
    
    this.chart.update('none');
  };

  // Removes dataset from previous span calculation
  private removeData(chart: Chart): void {
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop()
    })
  };
  
  // Add new dataset 
  private addData(chart: Chart, newData: ChartData<'line', point[]>): void {
    chart.data = newData
  };

  private setOptions(chart: Chart, rot: number = 0, sizePts: number = 12, titleX: string = 'psi', titleY: string = 'mA', sizeTitle: number = 15): void {

    chart.options = {
      
      scales: {
        
        x: {
          title: {
            display: true,
            text: titleX,
            font: {
              size: sizeTitle,
              weight: 'bold'
            }
          },
          display: true,
          type: 'linear',
          grid: {
            drawTicks: true
          }
        },
        y: {
          title: {
            display: true,
            text: titleY,
            font: {
              size: sizeTitle,
              weight: 'bold',
            }
          },
          display: true,
          type: 'linear',
          grid: {
            drawTicks: true
          }
        }
        
      },
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          display: true,
          anchor: 'center',
          align: 'top',
          formatter: (point, ctx) => {
            let idx = ctx.dataIndex;
            return `${point.x}, ${point.y}`;
          },
          rotation: (ctx) => {
              return rot
          },
          labels: {
            title: {
              font: {
                size: sizePts
              }
            }
          }

        },
        tooltip: {
          enabled: false
        }
      }
    }
    
    return
  };


  constructor() {};

  public datasets: ChartData<'line', point[]> = {
    datasets:[{ 
      data: this.points,
      parsing: {
        xAxisKey: 'x',
        yAxisKey: 'y',
      },

    }]
  };

  public chart: Chart = null!;

  private createChart(): void {

    Chart.register(ChartDataLabels)

    this.chart = new Chart("MyChart", {
      type: 'line', 
       data: this.datasets,
    })
    
    this.setOptions(this.chart);
    
  };

  public spanChartOptions: ChartOptions<'line'> = {
    responsive: false
  };

  ngOnInit() {
    this.createChart();
    this.chart.update();
  };
}
