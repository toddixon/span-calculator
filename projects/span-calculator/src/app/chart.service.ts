import { Injectable, afterRender } from '@angular/core';
import { Chart, ChartData, ChartDataset, ChartDatasetProperties, ChartOptions, ScriptableChartContext } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { point, chartData } from './point';
import { Anchor, Align, Font } from 'chartjs-plugin-datalabels/types/options';

// This service is in charge of managing the chart created in span-graph.component as the span values change.

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  charStr: string = '';

  updateChart(chart: Chart, chartData: chartData, isDarkTheme: boolean) {
    this.removeData(chart);
    let chartDataSet = this.buildDataSet(chartData.points, chartData.calcPoint);
    this.addData(chart, chartDataSet);
    this.setOptions(chart, isDarkTheme, chartData.unitsX, chartData.unitsY);
    chart.update('none');
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


  setOptions(chart: Chart, isDarkTheme: boolean, titleX?: string, titleY?: string, rot: number = 0, sizePts: number = 16, sizeTitle: number = 15, isPortrait: boolean = false) : string {
    this.titleX = titleX!;
    this.titleY = titleY!;
    let fontColor: string;
    let fontColorActive: string;
    let gridColor: string;
    let charStr: string = '';

    let themeColors = {
      light: {
        grid: '#d8d8d8',
        text: '#0a0a0a',
        textActive: '#191919'
      }, 
      dark: {
        text: '#cccccc',
        textActive: '#ffffff',
        grid: '#3d3d3d',
      }
    }

    if (isDarkTheme){
      fontColor = themeColors.dark.text;
      fontColorActive = themeColors.dark.textActive
      gridColor = themeColors.dark.grid;
    }
    else {
      fontColor = themeColors.light.text;
      fontColorActive = themeColors.light.textActive;
      gridColor = themeColors.light.grid;
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
              color: function(ctx) {
                 return ctx.active ?  fontColorActive : fontColor;
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
          listeners: {
            enter: function(ctx, event) {
              ctx.active = true;
              return true;
            },
            leave: function(ctx, event) {
              ctx.active = false;
              return true;
            }
          }
        },

        tooltip: {
          enabled: false
        }
      },
    }
    return charStr;
  };

  public chart: Chart = null!;
  public titleX: string = 'Output';
  public titleY: string = 'Input';

  createChart(points: point[] | any, isDarkTheme: boolean, name: string = "myChart"): Chart {
    Chart.register(ChartDataLabels)
    let dataset = this.buildDataSet(points, null);

    if (this.chart) {
      this.chart.destroy();
    } 

    this.chart = new Chart(name, {
      type: 'line',
      data: dataset,
    })

    this.setOptions(this.chart, isDarkTheme, 'Output', 'Input');
    return this.chart;
  };

  // Called whenever 'BreakpointObserver' detects a size change
  redrawChart(isDarkTheme: boolean): void {
    if (this.chart) {
      this.setOptions(this.chart, isDarkTheme, this.titleX, this.titleY);
      this.chart.update('none');
    }
    return
  };

  getChart(): Chart {
    return this.chart;
  }

  resizeChart(width: number = 100, height: number = 500): void {
    this.chart.resize(this.chart.width, this.chart.height + height);
  }

}
