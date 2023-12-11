import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartDatasetProperties, ChartOptions, LinearScale } from 'chart.js';
import { Observable, Subscription } from 'rxjs';

import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { Chart } from 'chart.js';

import { point } from '../point';


@Component({
  selector: 'app-span-graph',
  templateUrl: './span-graph.component.html',
  styleUrls: ['./span-graph.component.scss']
})
export class SpanGraphComponent implements OnChanges, OnInit, OnDestroy{

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

    // let chartData: ChartDatasetProperties<'line', point[]> = { 
    //   data: this.points 
    // };

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

    //this.updateScales(chart);
    
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
    this.chart = new Chart("MyChart", {
      type: 'line', 
       data: this.datasets,
      options: {
        scales: {
          x: {
            display: true,
            type: 'linear'
          },
          y: {
            display: true,
            type: 'linear'
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                
                if (label) {
                  label += ': ';
                };
                if (context.parsed.y !== null) {
                  label += `${context.parsed.y}mA`
                }
                if (context.parsed.x !== null) {
                  label += `${context.parsed.x}psi`
                }
                return label;
              }
            }
          }
        }
      }
    })
  };

  public spanChartOptions: ChartOptions<'line'> = {
    responsive: false
  };

  ngOnInit() {
    this.createChart();
  };
  ngOnDestroy(): void {

  };

}
