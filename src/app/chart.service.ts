import { Injectable, afterRender } from '@angular/core';
import { Chart, ChartData, ChartDataset, ChartDatasetProperties, ScriptableChartContext } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { point, chartData } from './point';
import { Anchor, Align, Font } from 'chartjs-plugin-datalabels/types/options';

// This service is in charge of managing the chart created in span-graph.component as the span values change.

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  updateChart(chart: Chart, chartData: chartData) {
    this.removeData(chart);
    let chartDataSet = this.buildDataSet(chartData.points, chartData.calcPoint);
    this.addData(chart, chartDataSet);
    this.setOptions(chart, chartData.unitsX, chartData.unitsY);
    chart.update('none'); // Update line chart with no animation
  };

  private buildDataSet(points: point[], calcPoint: point | null): ChartData<"line", point[], unknown> {
    let datasets: ChartData<'line', point[]> = {
      datasets: [{
        data: points,
        parsing: {
          xAxisKey: 'x',
          yAxisKey: 'y',
        },
        pointRadius: 5,
        //order: 1,
      }]
    };
    if (calcPoint) {
      let pseudoPts: point[] = [points[0], calcPoint, points[points.length - 1]];
      let point: ChartDataset<'line', point[]> = {
        data: pseudoPts,
        pointRadius: [0, 7, 0],
        pointBackgroundColor: '#3f51b5',
        showLine: false,
        order: 0,
      }
      datasets.datasets[0].order = 1;
      datasets.datasets.push(point);
    };

    return datasets;
  };

  // Removes dataset from previous span calculation
  removeData(chart: Chart<any>): void {
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    })
  };

  // Add new dataset 
  private addData(chart: Chart, newData: ChartData<'line', point[]>): void {
    chart.data = newData;
  };

  setOptions(chart: Chart, titleX: string = 'Output', titleY: string = 'Input', rot: number = 0, sizePts: number = 16, sizeTitle: number = 15, isPortrait: boolean = false) : void {

    chart.options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
        onComplete: function(event) {
          chart.hide;
        }
      },
      scales: {
        x: {
          beginAtZero: false,
          title: {
            display: true,
            text: '(x) - ' + titleX,
            font: {
              size: sizeTitle,
              weight: 'bold'
            }
          },
          display: true,
          type: 'linear',
          offset: true,
          grid: {
            drawTicks: true
          }
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: '(y) - ' + titleY,
            font: {
              size: sizeTitle,
              weight: 'bold',
            }
          },
          display: true,
          type: 'linear',
          offset: true,
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
          formatter: (point, ctx) => {
            let idx = ctx.dataIndex;
            return `(${point.x}, ${point.y})`;
          },
          align: (ctx) => {
            let align: Align = 'top'
            if (ctx.datasetIndex == 1){
              align = 'right'
            }

            return align;
          },
          offset: (ctx) => {
            let offset: number = 5;
            if (ctx.dataIndex == 0) {
              offset = 10;
            }
            else if (ctx.dataIndex == ctx.dataset.data.length - 1) {
              offset = -2;
            };
            return offset;
          },
          clamp: true,
          clip: false,
          rotation: rot,
          labels: {
            title: {
              display: (ctx) => {
                let display: string | boolean = 'auto';
                if (ctx.datasetIndex == 1) {
                  switch(ctx.dataIndex) {
                    case 0: display = false;
                    break;
                    case 1: display = true;
                    break;
                    case 2: display = false; 
                    break;
                  }
                };
                return display;
              },
              font: (ctx) => {
                let font: Font = {};
                if (ctx.datasetIndex == 0) {
                  font.size = sizePts;
                  font.weight = 'normal';
                }
                else {
                  font.size = sizePts;
                  font.weight = 'bold'
                }
                return font
              }
            }
          },
        },

        tooltip: {
          enabled: false
        }
      },
    }
    return
  };

  public chart: Chart = null!;

  createChart(points: point[] | any, name: string = "myChart"): Chart {
    Chart.register(ChartDataLabels)
    let dataset = this.buildDataSet(points, null);

    if (this.chart) {
      this.chart.destroy();
    } 

    this.chart = new Chart(name, {
      type: 'line',
      data: dataset,
    })

    this.setOptions(this.chart);
    return this.chart
  };

  // Called whenever 'BreakpointObserver' detects a size change
  redrawChart(): void {
    if (this.chart) {
      this.setOptions(this.chart)
      this.chart.render() // Trigger redraw of all chart elements
      this.chart.update('none')
    }

  };

  getChart(): Chart {
    return this.chart;
  }
  getChartStr(): string {
    return this.chart.toBase64Image();
  }

}
