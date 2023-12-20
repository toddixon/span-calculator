import { Injectable } from '@angular/core';
import { Chart, ChartData} from 'chart.js';
import { PrintService } from './print.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { point } from './point';

// This service is in charge of managing the chart created in span-graph.component as the span values change.

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private printService: PrintService) { }

  updateChart(chart: Chart, points: point[]) {

    this.removeData(chart);

    let chartDataSet = this.buildDataSet(points);
    
    this.addData(chart, chartDataSet);
    this.setOptions(chart);

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

  public chart: Chart = null!;

  createChart(points: point[]): Chart {
    Chart.register(ChartDataLabels)
    this.chart = new Chart("MyChart", {
      type: 'line',
      data: this.buildDataSet(points),
    })
    this.setOptions(this.chart);

    return this.chart
  };

  // calls BehaviorSubject's next method, giving it a new value
  printGraph(): void {
    this.printService.getChart(this.chart);
  }


}
