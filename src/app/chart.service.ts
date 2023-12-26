import { Injectable } from '@angular/core';
import { Chart, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { point, chartData } from './point';

// This service is in charge of managing the chart created in span-graph.component as the span values change.

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  updateChart(chart: Chart, chartData: chartData) {
    this.removeData(chart);
    let chartDataSet = this.buildDataSet(chartData.points);
    this.addData(chart, chartDataSet);
    this.setOptions(chart, chartData.unitsX, chartData.unitsY);

    this.chart.update('none'); // Update line chart with no animation
  };

  private buildDataSet(points: point[]): ChartData<"line", point[], unknown> {
    let datasets: ChartData<'line', point[]> = {
      datasets: [{
        data: points,
        parsing: {
          xAxisKey: 'x',
          yAxisKey: 'y',
        },
  
      }]
    };
    return datasets;
  };

  // Removes dataset from previous span calculation
  removeData(chart: Chart<any>): void {
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop()
    })
  };

  // Add new dataset 
  private addData(chart: Chart, newData: ChartData<'line', point[]>): void {
    chart.data = newData
  };

  private setOptions(chart: Chart,  titleX: string = 'Output', titleY: string = 'Input', rot: number = 0, sizePts: number = 12, sizeTitle: number = 15): void {
    chart.options = {
      responsive: true,
      maintainAspectRatio: false,
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
          //grace: '5%',
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
      },
      // animation: {
      // duration: 1000,
      // easing: 'easeInCubic'
      // }
    }

    return
  };

  public chart: Chart = null!;

  createChart(points: point[] | any, name: string = "MyChart"): Chart {
    Chart.register(ChartDataLabels)
    this.chart = new Chart(name, {
      type: 'line',
      data: this.buildDataSet(points),
    })
    this.setOptions(this.chart);
    //this.chart.resize(900, 800)
    return this.chart
  };

  getChart(): Chart {
    return this.chart;
  }
  getChartStr(): string {
    return this.chart.toBase64Image(); 
  }

}
