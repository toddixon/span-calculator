import { AfterViewChecked, Component, Injector, OnDestroy, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControlService, data } from './form-control.service';

import { CalcSpanService } from './calc-span.service';
import { ChartService } from './chart.service';
import { PrintService } from './print.service';
import { point, chartData } from './point';
// const ipc = require('electron').ipcRenderer;

// Second form group for Output controls 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  private readonly debounceTime = 300;
  valBoxStep: number = 0.10;

  destroyed = new Subject<void>();
  swLayout: boolean = false;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
    [Breakpoints.HandsetPortrait, 'HandsetPortrait'],
    [Breakpoints.HandsetLandscape, 'HandsetLandscape']

  ]);
  currentScreenSize: string = 'medium';
  isPortrait: boolean = false;
  isDarkTheme: boolean = false;
  state: 'small' | 'medium' = 'small';
  matFieldAppearance: 'fill' | 'outline' = 'outline';

  sigKeys: String[] = [];
  spanCalcForm: FormGroup;
  lrvLast: boolean = true;// whether the LRV input box/slider was the last control adjusted or one of the URV controls

  points: Array<point> = [];
  calcPoint: point | undefined = undefined; // point calculation based on the value the user has typed into either the input or output FormControl
  chartData: chartData = { points: this.points, unitsX: 'Output', unitsY: 'Input', calcPoint: null };

  // @ViewChild(PrintLayoutComponent) printLayoutComponent!: PrintLayoutComponent;

  constructor(
    private calcSpanService: CalcSpanService,
    private chartService: ChartService,
    public printService: PrintService,
    public formService: FormControlService,
    breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.XSmall, // 599px-
      Breakpoints.Small, // 600px-959px //have it switch to one column when it gets below this
      Breakpoints.Medium, // 960px-1279px 
      Breakpoints.Large, // 1280px-1919px
      Breakpoints.XLarge, // 1920px+
      Breakpoints.HandsetPortrait, // (max-width: 599.98px) and (orientation: portrait)
      Breakpoints.HandsetLandscape // 	(max-width: 959.98px) and (orientation: landscape)
    ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
            switch (this.currentScreenSize) {
              case 'Small':
                // this.chartService.redrawChart();
                this.isPortrait = false;
                break;
              case 'XSmall':
                // this.chartService.redrawChart();
                this.isPortrait = false;
                break;
              case 'Medium':
                // this.chartService.redrawChart();
                this.isPortrait = false;
                break;
              case 'Large':
                // this.chartService.redrawChart();
                this.isPortrait = false;
                break;
              case 'XLarge':
                // this.chartService.redrawChart();
                this.isPortrait = false;
                break;
              case 'HandsetPortrait':
                // this.chartService.redrawChart();
                this.isPortrait = true;
                break;
              case 'HandsetLandscape':
                // this.chartService.redrawChart();
                this.isPortrait = false;
                break;
              default:
                this.isPortrait = false;
            }
          }
        }
      });
    this.spanCalcForm = this.formService.buildForm();
  };

  ngOnInit(): void {
    this.sigKeys = this.calcSpanService.getSigTypes();// Get signal presets used in both Input and Output Form select boxes
    this.formService.getData().pipe(debounceTime(this.debounceTime)).subscribe(
      (data) => { this.calculateSpan(data) }
    );
    this.spanCalcForm.controls['selectPrimary'].setValue(true); // Set the Input signal as primary 
  };
  ngAfterViewChecked(): void {
    this.spanCalcForm.get('inputRangesForm')!.setValidators([this.formService.validateRanges()]);
    this.spanCalcForm.get('outputRangesForm')!.setValidators([this.formService.validateRanges()]);
  };
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  };

  calculateSpan(data: data): void {
    [this.points, this.calcPoint] = this.calcSpanService.calcSpan(data.input, data.output, data.prim, data.val);
    this.chartData = { points: this.points, unitsX: data.units.x, unitsY: data.units.y, calcPoint: this.calcPoint };
  };

  onThemeChange(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.chartService.redrawChart(this.isDarkTheme);
  };

  onPrintGraph() {
    // this.chartService.resizeChart();
    if (this.isDarkTheme) {
      this.chartService.redrawChart(false);
      this.printService.sendData(null);
      this.chartService.redrawChart(true);
    }
    else {
      this.printService.sendData(null);
    }
    return
  };
  onSaveGraph(): void {
    this.printService.saveGraph();
  };

}