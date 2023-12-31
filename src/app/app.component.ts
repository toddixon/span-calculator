import { AfterViewChecked, Component, Injector, OnDestroy, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormControl, FormGroup, AbstractControl, Validators, ValidatorFn, ValidationErrors, Form, ControlValueAccessor, NG_VALIDATORS } from '@angular/forms';
import { Subject, debounceTime, pairwise, startWith, takeUntil } from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { CalcSpanService } from './calc-span.service';

import { range } from './range';
import { point, chartData } from './point';
import { PrintService } from './print.service';
import { path } from 'd3';

// Second form group for Output controls
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  valBoxStep: number = 0.10;

  // Style settings for <mat-grid-list>
  cols: number = 3;
  rowHeight_grid: string | number = "fit"; // Used in template for <mat-grid-list> element 
  gutterSize_grid: string = "12px"; // Sets gutter size between neighboring <mat-grid-tile> elements
  destroyed = new Subject<void>();
  currentScreenSize: string | undefined;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);



  inputPrim: boolean = true;// Whether input is the primary signal else output
  inputSig: { units: string, range: range } = { units: 'Input', range: { lrv: 0, urv: 10 } };
  outputSig: { units: string, range: range } = { units: 'Output', range: { lrv: 0, urv: 10 } };

  spanTableCols: string[] = ['Input', 'Output']; // Dynamic names for mat-table columns
  spanTableDemoCols: string[] = ['Input', 'Output']; // Static names for mat-table columns

  sigKeys: String[] = [];

  spanCalcForm: FormGroup;
  inputRangesForm: FormGroup;
  outputRangesForm: FormGroup;
  selectPrimary: AbstractControl;

  //incriment: boolean | undefined = undefined;
  lrvLast: boolean = true;// whether the LRV input box/slider was the last control adjusted or one of the URV controls
  private readonly debounceTime = 300;
  points: Array<point> = [];
  calcPoint: point | undefined = undefined; // point calculation based on the value the user has typed into either the input or output FormControl
  chartData: chartData = { points: this.points, unitsX: 'Output', unitsY: 'Input', calcPoint: null };
  updateSpan: Subject<void> = new Subject<void>();

  constructor(
    private calcSpanService: CalcSpanService,
    private printService: PrintService,
    breakpointObserver: BreakpointObserver) {
      breakpointObserver.observe([
        Breakpoints.XSmall, // 599px-
        Breakpoints.Small, // 600px
        Breakpoints.Medium, // 960px
        Breakpoints.Large, // 1280px
        Breakpoints.XLarge, // 1920px+
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });

    // First form group for Input controls
    this.inputRangesForm = new FormGroup({
      input: new FormControl(''),
      sigType: new FormControl(''),
      lrv: new FormControl(this.inputSig.range.lrv, [Validators.required]),
      lrvSl: new FormControl(this.inputSig.range.lrv, Validators.required),
      urv: new FormControl(this.inputSig.range.urv, Validators.required),
      urvSl: new FormControl(this.inputSig.range.urv, Validators.required),
    });

    this.outputRangesForm = new FormGroup({
      output: new FormControl(''),
      sigType: new FormControl(''),
      lrv: new FormControl(this.outputSig.range.lrv, Validators.required),
      lrvSl: new FormControl(this.outputSig.range.lrv, Validators.required),
      urv: new FormControl(this.outputSig.range.urv, Validators.required),
      urvSl: new FormControl(this.outputSig.range.urv, Validators.required),
    });

    // Nest input and output formgroups into spanCalcForm
    this.spanCalcForm = new FormGroup({
      inputRangesForm: this.inputRangesForm,
      outputRangesForm: this.outputRangesForm,
      selectPrimary: new FormControl(true, Validators.requiredTrue),
    });

    let [input, sigTypeIn, lIn, lSlIn, uIn, uSlIn] = this.getInputControls();
    input?.valueChanges.subscribe((v) => {
      this.onSpanChange();
    });
    sigTypeIn?.valueChanges.subscribe((v) => {
      this.inputSig = { units: v, range: this.calcSpanService.getSignalParams(v) };
      this.onSigTypeChange(this.inputSig, { input: lIn, slider: lSlIn }, { input: uIn, slider: uSlIn });
      this.onSpanChange();
    });
    lIn?.valueChanges.pipe(startWith(this.inputSig.range.lrv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = true;
      lSlIn?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });
    lSlIn?.valueChanges.pipe(startWith(this.inputSig.range.lrv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = true;
      lIn?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });
    uIn?.valueChanges.pipe(startWith(this.inputSig.range.urv), pairwise()).subscribe(([vPrev, v]) => {
      uSlIn?.setValue(v, { emitEvent: false });
      this.onSpanChange();
      this.lrvLast = false;
    });
    uSlIn?.valueChanges.pipe(startWith(this.inputSig.range.urv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = false;
      uIn?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });

    let [output, sigTypeOut, lOut, lSlOut, uOut, uSlOut] = this.getOutputControls();
    output?.valueChanges.subscribe((v) => {
      this.onSpanChange();
    });
    sigTypeOut?.valueChanges.subscribe((v) => {
      this.outputSig = { units: v, range: this.calcSpanService.getSignalParams(v) };
      this.onSigTypeChange(this.outputSig, { input: lOut, slider: lSlOut }, { input: uOut, slider: uSlOut });
      this.onSpanChange();
    });
    lOut?.valueChanges.pipe(startWith(this.outputSig.range.lrv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = true;
      lSlOut?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });
    lSlOut?.valueChanges.pipe(startWith(this.outputSig.range.lrv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = true;
      lOut?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });
    uOut?.valueChanges.pipe(startWith(this.outputSig.range.urv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = false;
      uSlOut?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });
    uSlOut?.valueChanges.pipe(startWith(this.outputSig.range.urv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = false;
      uOut?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });

    this.selectPrimary = this.spanCalcForm.controls['selectPrimary'];

    this.selectPrimary.valueChanges.subscribe((s) => {
      if (s) {
        this.chartData.unitsX = this.outputSig.units;
        this.chartData.unitsY = this.inputSig.units;
        input.enable({ emitEvent: false });
        output.disable({ emitEvent: false });
        output.setValue(null, { emitEvent: false });
      }
      else {
        this.chartData.unitsX = this.inputSig.units;
        this.chartData.unitsY = this.outputSig.units;
        input.disable({ emitEvent: false });
        output.enable({ emitEvent: false });
        input.setValue(null, { emitEvent: false });
      };
      this.onSpanChange();
    });
  };

  ngOnInit(): void {
    this.sigKeys = this.calcSpanService.getSigTypes();
    this.selectPrimary.setValue(true); // Set the Input signal as primary 
    this.calculateSpan();
    this.updateSpan.pipe(debounceTime(this.debounceTime)).subscribe(
      (_) => { this.calculateSpan() }
    );
  };

  ngAfterViewChecked(): void {
    this.inputRangesForm.setValidators([this.checkRanges()]);
    this.outputRangesForm.setValidators([this.checkRanges()]);
  };

  ngOnDestroy(): void {
      //this.destro
  }

  // Have each form control call this function with the 
  private onSpanChange() {
    this.updateSpan.next();
  };
  private onSigTypeChange(sig: typeof this.inputSig, lrvControls: { input: AbstractControl, slider: AbstractControl }, urvControls: { input: AbstractControl, slider: AbstractControl }): void {
    if (lrvControls.input.value < sig.range.lrv || lrvControls.input.value > sig.range.urv) {
      lrvControls.input.setValue(sig.range.lrv);
    };
    if (urvControls.input.value > sig.range.urv || urvControls.input.value < sig.range.lrv) {
      urvControls.input.setValue(sig.range.urv);
    };
  };

  // When user clicks print button
  onPrintGraph() {
    this.printService.printGraph();
  };
  // When user clicks download button
  onSaveGraph() {
    this.printService.saveGraph();
  };

  // Custom validator function for formgroup controls
  public checkRanges(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const lrvControls: { input: AbstractControl, slider: AbstractControl } = { input: control.get('lrv')!, slider: control.get('lrvSl')! };
      const urvControls: { input: AbstractControl, slider: AbstractControl } = { input: control.get('urv')!, slider: control.get('urvSl')! };

      //console.log(this.incriment);

      // Identify whether it's the inputRangesForm or outputRangesForm group
      let sig: typeof this.inputSig;
      if (lrvControls.input.parent == this.inputRangesForm) {
        sig = this.inputSig
      }
      else { sig = this.outputSig };

      // If LRV was the last control changed && LRV == URV
      if (lrvControls.input.value == urvControls.input.value) {
        lrvControls.input.markAsTouched();
        urvControls.input.markAsTouched();
        lrvControls.input.setErrors({ equal: true });
        urvControls.input.setErrors({ equal: true });
        lrvControls.slider.setErrors({ equal: true});
        return { 'equal': true };
      }
      // Error if LRV < inMin
      else if (lrvControls.input.value < sig!.range.lrv) {
        //lrvControls.input.setValue(sig.range.lrv);
        lrvControls.input.setErrors({ outRangeMin: true });
        return { 'outRangeMin': true };
      }
      else if (lrvControls.input.value > sig!.range.urv) {
        //lrvControls.input.setValue(sig.range.urv - 1);
        lrvControls.input.setErrors({ outRangeMax: true });
        return { 'outRangeMax': true };
      }
      // Error if URV > inMax
      else if (urvControls.input.value > sig!.range.urv) {
        //urvControls.input.setValue(sig.range.urv);
        urvControls.input.setErrors({ outRangeMax: true });
        return { 'outRangeMax': true };
      }
      else if (urvControls.input.value < sig!.range.lrv) {
        // lrvControls.input.setValue(sig.range.lrv + 1);
        urvControls.input.setErrors({ outRangeMin: true });
        return { 'outRangeMin': true };
      }
      // Otherwise no errors
      else {
        return null;
      };
    };
  };

  setPairedControlValues(control: { input: AbstractControl, slider: AbstractControl }, value: number): void {
    control.input.setValue(value, { emitEvent: false });
    control.slider.setValue(value, { emitEvent: false });
    return;
  };

  checkTouched(): void {
    const lIn = this.inputRangesForm.controls['lrv'];
    const lSlIn = this.inputRangesForm.controls['lrvSl'];
    const uIn = this.inputRangesForm.controls['urv'];
    const uSlIn = this.inputRangesForm.controls['urvSl'];

    const lOut = this.outputRangesForm.controls['lrv'];
    const lSlOut = this.outputRangesForm.controls['lrvSl'];
    const uOut = this.outputRangesForm.controls['urv'];
    const uSlOut = this.outputRangesForm.controls['urvSl'];

    let strInput: string = "--Input Controls--" + "\nLRV input box: " + lIn.pristine + "\nURV input box: " + uIn.pristine + "\nLRV slider: " + lSlIn.pristine + "\nURV slider: " + uSlIn.pristine + "\n\n";
    let strOutput: string = "--Output Controls--" + "\nLRV input box: " + lOut.pristine + "\nURV input box: " + uOut.pristine + "\nLRV slider: " + lSlOut.pristine + "\nURV slider: " + uSlOut.pristine + "\n\n";

    console.log(strInput + strOutput);
    return;
  };

  getControlVals(): [boolean, range, range, number | undefined] {
    let inputPrim: boolean = this.spanCalcForm.controls['selectPrimary'].value;
    let val: number | undefined = undefined;
    if (inputPrim) {
      val = this.inputRangesForm.controls['input'].value;
    }
    else {
      val = this.outputRangesForm.controls['output'].value;
    };
    let inputRng: range = {
      lrv: this.inputRangesForm.controls['lrv'].value,
      urv: this.inputRangesForm.controls['urv'].value
    };
    let outputRng: range = {
      lrv: this.outputRangesForm.controls['lrv'].value,
      urv: this.outputRangesForm.controls['urv'].value
    };
    return [inputPrim, inputRng, outputRng, val];
  };

  // Gather all the group form controls for the Input section  
  private getInputControls(): [AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>] {
    const input = this.inputRangesForm.controls['input'];
    const sigType = this.inputRangesForm.controls['sigType'];
    const lIn = this.inputRangesForm.controls['lrv'];
    const lSlIn = this.inputRangesForm.controls['lrvSl'];
    const uIn = this.inputRangesForm.controls['urv'];
    const uSlIn = this.inputRangesForm.controls['urvSl'];
    return [input, sigType, lIn, lSlIn, uIn, uSlIn];
  };
  // Gather all the group form controls for the Output section
  private getOutputControls(): [AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>] {
    const output = this.outputRangesForm.controls['output'];
    const sigType = this.outputRangesForm.controls['sigType'];
    const lOut = this.outputRangesForm.controls['lrv'];
    const lSlOut = this.outputRangesForm.controls['lrvSl'];
    const uOut = this.outputRangesForm.controls['urv'];
    const uSlOut = this.outputRangesForm.controls['urvSl'];
    return [output, sigType, lOut, lSlOut, uOut, uSlOut];
  };
  calculateSpan(): void {
    let [prim, input, output, val] = this.getControlVals();
    [this.points, this.calcPoint] = this.calcSpanService.calcSpan(input, output, prim, val);
    this.chartData = { points: this.points, unitsX: this.outputSig.units, unitsY: this.inputSig.units, calcPoint: this.calcPoint };
  };
}