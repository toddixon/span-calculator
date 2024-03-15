import { Injectable } from '@angular/core';
import { Chart, ChartData, ChartDataset } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { point, chartData } from './point';
import { Align, Font } from 'chartjs-plugin-datalabels/types/options';


// This service is in charge of managing the chart created in span-graph.component as the span values change.

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  charStr = '';

  updateChart(chart: Chart, chartData: chartData, isDarkTheme: boolean) {
    this.removeData(chart);
    const chartDataSet = this.buildDataSet(chartData.points, chartData.calcPoint);
    this.addData(chart, chartDataSet);
    this.setOptions(chart, isDarkTheme, chartData.unitsX, chartData.unitsY);
    chart.update('none');
  }

  private buildDataSet(points: point[], calcPoint: point | null): ChartData<"line", point[], unknown> {
    const datasets: ChartData<'line', point[]> = {
      datasets: [{
        data: points,
        parsing: {
          xAxisKey: 'x',
          yAxisKey: 'y',
        },
        pointRadius: 5,
        order: 1,
      }]
    };
    if (calcPoint) {
      const pseudoPts: point[] = [points[0], calcPoint, points[points.length - 1]];
      const point: ChartDataset<'line', point[]> = {
        data: pseudoPts,
        pointRadius: [0, 7, 0],
        pointBackgroundColor: '#3f51b5',
        showLine: false,
        order: 0,
      }
      datasets.datasets[0].order = 1;
      datasets.datasets.push(point);
    }

    return datasets;
  }

  // Removes dataset from previous span calculation
  removeData(chart: Chart<any>): void {
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    })
  }

  // Add new dataset 
  private addData(chart: Chart, newData: ChartData<'line', point[]>): void {
    chart.data = newData;
  }


  setOptions(chart: Chart, isDarkTheme: boolean, titleX?: string, titleY?: string, rot = 0, sizePts = 12, sizeTitle = 15, isPortrait = false): string {
    this.titleX = titleX!;
    this.titleY = titleY!;
    let fontColor: string;
    let fontColorActive: string;
    let gridColor: string;
    const charStr = '';
    let backgroundColor: string;

    if (isDarkTheme) {
      fontColor = '#cccccc';
      fontColorActive = '#ffffff';
      gridColor = '#3d3d3d';
      backgroundColor = 'rgba(71, 71, 71, .5)';
    }
    else {
      fontColor = '#0a0a0a';
      fontColorActive = '#191919';
      gridColor = '#d8d8d8';
      backgroundColor = 'rgba(204, 204, 204, .5)';
    }

    chart.options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      scales: {
        x: {
          beginAtZero: false,
          title: {
            display: true,
            color: fontColor,
            text: titleX,
            font: {
              size: sizeTitle,
              weight: 'bold'
            }
          },
          display: true,
          type: 'linear',
          offset: true,
          ticks: {
            color: fontColor,
          },
          border: {
            color: gridColor,
          },
          grid: {
            drawTicks: true,
            color: gridColor,
          },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            color: fontColor,
            text: titleY,
            font: {
              size: sizeTitle,
              weight: 'bold',
            }
          },
          display: true,
          type: 'linear',
          offset: true,
          ticks: {
            color: fontColor,
          },
          border: {
            color: gridColor,
          },
          grid: {
            drawTicks: true,
            color: gridColor,
          },
        }
      },
      plugins: {
        legend: {
          display: false
        },

        datalabels: {
          borderRadius: 5,
          backgroundColor: (ctx) => {
            return backgroundColor;
          },
          display: true,
          formatter: (point, ctx) => {
            const idx = ctx.dataIndex;
            return `(${point.x}, ${point.y})`;
          },
          align: (ctx) => {
            let align: Align = 'top'
            if (ctx.datasetIndex == 1) {
              align = 'right'
            }
            return align;
          },
          offset: (ctx) => {
            let offset = 5;
            if (ctx.dataIndex == 0) {
              offset = 10;
            }
            else if (ctx.dataIndex == ctx.dataset.data.length - 1) {
              offset = -2;
            }
            return offset;
          },
          clamp: true,
          clip: false,
          rotation: rot,
          labels: {
            title: {
              display: (ctx) => {
                let display: string | boolean = 'auto';
                if (ctx.active) {
                  display = true;
                }
                return display;
              },
              color: function (ctx) {
                return ctx.active ? fontColorActive : fontColor;
              },
              font: (ctx) => {
                const font: Font = {};
                font.size = sizePts;
                font.weight = 'normal';
                font.size = ctx.active ? sizePts + 4 : sizePts;
                return font
              }
            }
          },
          listeners: {
            enter: function (ctx, event) {
              ctx.active = true;

              return true;
            },
            leave: function (ctx, event) {
              ctx.active = false;
              return true;
            }
          }
        },

        tooltip: {
          enabled: false,
        }
      },
    }
    return charStr;
  }

  public chart: Chart = null!;
  public titleX = 'Output';
  public titleY = 'Input';

  createChart(points: point[] | any, isDarkTheme: boolean, name = "myChart"): Chart {
    Chart.register(ChartDataLabels);

    const dataset = this.buildDataSet(points, null);
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(name, {
      type: 'line',
      data: dataset,
    })


    this.setOptions(this.chart, isDarkTheme, 'Output', 'Input');
    return this.chart;
  }

  // Called whenever 'BreakpointObserver' detects a size change
  redrawChart(isDarkTheme: boolean): void {
    if (this.chart) {
      this.setOptions(this.chart, isDarkTheme, this.titleX, this.titleY);
      this.chart.update('none');
      this.chart.render();
    }
    return
  }

  getChart(): Chart {
    return this.chart;
  }

  resizeChart(width = 700, height = 400): void {
    this.chart.resize(width, height);

  }

}
