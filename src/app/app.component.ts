import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormControl, FormGroup, AbstractControl, Validators, ValidatorFn, ValidationErrors, Form } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';

import { CalcSpanService } from './calc-span.service';
import { PrintService } from './print.service';

import { range } from './range';
import { point } from './point';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  inMin: number = 0;
  inMax: number = 10;
  outMin: number = 0;
  outMax: number = 10;

  rowHeight_grid: string | number = "fit"; // Used in template for <mat-grid-list> element 
  gutterSize_grid: string = "3px"; // Sets gutter size between neighboring <mat-grid-tile> elements

  inputPrim: boolean = true;// Whether input is the primary signal else output
  sigKeys: String[] = [];// String[] === Array<String>

  spanCalcForm: FormGroup;
  inputRangesForm: FormGroup;
  outputRangesForm: FormGroup;
  selectPrimary: FormControl;

  //last: AbstractControl;
  lrvLast: boolean;// whether the LRV input box/slider was the last control adjusted or one of the URV controls

  private readonly debounceTime = 300;
  points: Array<point> = [];

  updateSpan: Subject<void> = new Subject<void>();

  constructor(
    private calcSpanService: CalcSpanService, 
    private printService: PrintService
    ) {
    // First form group for Input controls
    this.inputRangesForm = new FormGroup({
      input: new FormControl(''),
      lrv: new FormControl(this.inMin, Validators.required),
      lrvSl: new FormControl(this.inMin, Validators.required),
      urv: new FormControl(this.inMax, Validators.required),
      urvSl: new FormControl(this.inMax, Validators.required),
    }, this.checkRanges()),

      // Second form group for Output controls
      this.outputRangesForm = new FormGroup({
        output: new FormControl(''),
        lrv: new FormControl(this.inMin, Validators.required),
        lrvSl: new FormControl(this.inMin, Validators.required),
        urv: new FormControl(this.inMax, Validators.required),
        urvSl: new FormControl(this.inMax, Validators.required),
      }, this.checkRanges())

    this.selectPrimary = new FormControl(true, Validators.requiredTrue);

    // Nest input and output formgroups into spanCalcForm
    this.spanCalcForm = new FormGroup({
      inputRangesForm: this.inputRangesForm,
      outputRangesForm: this.outputRangesForm,
      selectPrimary: this.selectPrimary,
    })

    let [input, lIn, lSlIn, uIn, uSlIn] = this.getInputControls();

    this.lrvLast = true;// Input validation/error checking for sliders

    lIn?.valueChanges.subscribe((v) => {
      lSlIn?.setValue(v, { emitEvent: false });
      this.onSpanChange();
      this.lrvLast = true;
    });
    lSlIn?.valueChanges.subscribe((v) => {
      lIn?.setValue(v, { emitEvent: false });
      this.onSpanChange();
      this.lrvLast = true;
    });
    uIn?.valueChanges.subscribe((v) => {
      uSlIn?.setValue(v, { emitEvent: false });
      this.onSpanChange();
      this.lrvLast = false;
    });
    uSlIn?.valueChanges.subscribe((v) => {
      uIn?.setValue(v, { emitEvent: false });
      this.onSpanChange();
      this.lrvLast = false
    });

    let [output, lOut, lSlOut, uOut, uSlOut] = this.getOutputControls();

    lOut?.valueChanges.subscribe((v) => {
      lSlOut?.setValue(v, { emitEvent: false });
      this.onSpanChange();
      this.lrvLast = true;
    });
    lSlOut?.valueChanges.subscribe((v) => {
      lOut?.setValue(v, { emitEvent: false });
      this.onSpanChange();
      this.lrvLast = true;
    });
    uOut?.valueChanges.subscribe((v) => {
      uSlOut?.setValue(v, { emitEvent: false });
      this.onSpanChange();
      this.lrvLast = false;
    });
    uSlOut?.valueChanges.subscribe((v) => {
      uOut?.setValue(v, { emitEvent: false });
      this.onSpanChange();
      this.lrvLast = false
    });

    this.selectPrimary.valueChanges.subscribe((s) => {
      if(s) {
        input.enable();
        output.disable();
        output.setValue(null, {emitEvent: false})
      }
      else {
        input.disable();
        output.enable();
        input.setValue(null, {emitEvent: false})
      }

      this.onSpanChange();
    })
  }

  ngOnInit(): void {
    window.addEventListener("beforeprint", (event) => {
      console.log("beforePrint")
    })
    this.sigKeys = this.calcSpanService.getSigTypes();
    this.selectPrimary.setValue(true);
    this.updateSpan.pipe(debounceTime(this.debounceTime)).subscribe(
      (_) => { this.calculateSpan() }
    );
  }

  // Have each form control call this function with the 
  private onSpanChange() {
    this.updateSpan.next();
  }

  // When user clicks print button
  onPrintGraph() {
    this.printService.printGraph();
  };

  // Custom validator function to check if: LRV == URV
  public checkRanges(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const lrvControl = control.get('lrv')!;
      const urvControl = control.get('urv')!;
      // Error if LRV == URV && LRV was the last control changed
      if (this.lrvLast && (lrvControl.value == urvControl.value)) {
        lrvControl.setErrors({ equal: true });
        lrvControl.setValue(urvControl.value - 1);
        return { 'equal': true };
      }
      // Error if LRV == URV && URV was the last control changed
      else if (!this.lrvLast && (lrvControl.value == urvControl.value)) {
        urvControl.setErrors({ equal: true });
        urvControl.setValue(urvControl.value + 1);
        return { 'equal': true };
      }
      // Error if LRV < inMin
      else if (lrvControl.value < this.inMin) {
        lrvControl.setValue(this.inMin)
        lrvControl.setErrors({ OutRangeMin: true });
        return { 'OutRangeMin': true };
      }
      // Error if URV > inMax
      else if (urvControl.value > this.inMax) {
        urvControl.setValue(this.inMax)
        urvControl.setErrors({ OutRangeMax: true });
        return { 'OutRangeMax': true };
      }
      // Otherwise no errors
      else {
        urvControl.setErrors(null);
        return null
      }
    }
  }

  switchSignal(sKey: string) {
    let rng = this.calcSpanService.getSignalParams(sKey);
    this.inMin = rng.lrv;
    this.inMax = rng.urv;
    this.inputRangesForm.setValue({ lrvInput: rng.lrv, urvInput: rng.urv });
  };

  // Changes the sliders min/max based on the signal preset selected
  getSpan(sliderVal: string, t: string) {
    let val: number = +sliderVal;
    this.calcSpanService.getSpan(val, t);
  };

  getControlVals(): [boolean, range, range] {
    let inputRng: range = {
      lrv: this.inputRangesForm.controls['lrv'].value,
      urv: this.inputRangesForm.controls['urv'].value
    };
    let outputRng: range = {
      lrv: this.outputRangesForm.controls['lrv'].value,
      urv: this.outputRangesForm.controls['urv'].value
    };
    let inputPrim: boolean = this.spanCalcForm.controls['selectPrimary'].value;
    return [inputPrim, inputRng, outputRng]
  };

  // Gather all the group form controls for the Input section  
  private getInputControls(): [AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>] {
    const input = this.inputRangesForm.controls['input'];
    const lIn = this.inputRangesForm.controls['lrv'];
    const lSlIn = this.inputRangesForm.controls['lrvSl'];
    const uIn = this.inputRangesForm.controls['urv'];
    const uSlIn = this.inputRangesForm.controls['urvSl'];
    const inPrim = this.inputRangesForm.controls['inPrim'];
    return [input, lIn, lSlIn, uIn, uSlIn, inPrim];
  };
  // Gather all the group form controls for the Output section
  private getOutputControls(): [AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>, AbstractControl<any, any>] {
    const output = this.outputRangesForm.controls['output'];
    const lOut = this.outputRangesForm.controls['lrv'];
    const lSlOut = this.outputRangesForm.controls['lrvSl'];
    const uOut = this.outputRangesForm.controls['urv'];
    const uSlOut = this.outputRangesForm.controls['urvSl'];
    const outPrim = this.outputRangesForm.controls['outPrim'];
    return [output, lOut, lSlOut, uOut, uSlOut, outPrim];
  };

  // Should only call this function after passing the debounce delay
  calculateSpan(): void {
    let [prim, input, output] = this.getControlVals();
    let pointCount = 10;
    this.points = this.calcSpanService.calcSpan(input, output, prim, pointCount);
  };

};