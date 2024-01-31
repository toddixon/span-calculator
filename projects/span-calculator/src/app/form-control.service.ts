import { Injectable, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { FormControl, FormGroup, AbstractControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Subject, debounceTime, pairwise, startWith, takeUntil, distinctUntilChanged, Observable } from 'rxjs';
import { range } from './range';
import { point, chartData } from './point';
import { CalcSpanService } from './calc-span.service';

export interface data {
  prim: boolean,
  input: range,
  output: range,
  val: string,
  units: { x: string, y: string }
}

@Injectable({
  providedIn: 'root'
})
export class FormControlService implements OnInit {

  spanCalcForm: FormGroup | null = null;
  inputRangesForm: FormGroup | null = null;
  outputRangesForm: FormGroup | null = null;

  inputPrim: boolean = true;// Whether input is the primary signal else output
  inputSig: { units: string, range: range } = { units: 'Input', range: { lrv: 0, urv: 10 } };
  outputSig: { units: string, range: range } = { units: 'Output', range: { lrv: 0, urv: 10 } };

  lrvLast: boolean = true;// whether the LRV input box/slider was the last control adjusted or one of the URV controls
  private readonly debounceTime = 300;
  points: Array<point> = [];
  calcPoint: point | undefined = undefined; // point calculation based on the value the user has typed into either the input or output FormControl
  chartData: chartData = { points: this.points, unitsX: 'Output', unitsY: 'Input', calcPoint: null };
  // data: {prim: range, input: range, output: range, val: number | undefined, units: {x: string, y: string}};

  updateSpan: Subject<data> = new Subject<data>();


  constructor(
    private calcSpanService: CalcSpanService
  ) {

  }

  exp: RegExp = /(?<=\.(?:\d{2})).+|[^\d\.\-]|(?<!\s|^)\-|\.(?=.*\..+)|\s/;


  buildForm(): FormGroup {
    this.inputRangesForm = new FormGroup({
      input: new FormControl('', this.validateInteger(this.exp)),
      sigType: new FormControl(''),
      lrv: new FormControl(this.inputSig.range.lrv, [Validators.required]),
      lrvSl: new FormControl(this.inputSig.range.lrv, Validators.required),
      urv: new FormControl(this.inputSig.range.urv, Validators.required),
      urvSl: new FormControl(this.inputSig.range.urv, Validators.required),
    });

    this.outputRangesForm = new FormGroup({
      output: new FormControl('', this.validateInteger(this.exp)),
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

    const inputForm = this.inputRangesForm.controls;
    const outputForm = this.outputRangesForm.controls;

    inputForm['input']?.valueChanges.subscribe((v) => {
      this.onSpanChange();
    });
    inputForm['sigType']?.valueChanges.subscribe((v) => {
      this.inputSig = { units: v, range: this.calcSpanService.getSignalParams(v) };
      this.onSigTypeChange(this.inputSig, { input: inputForm['lrv'], slider: inputForm['lrvSl'] }, { input: inputForm['urv'], slider: inputForm['urvSl'] });
      this.onSpanChange();
    });

    inputForm['lrv']?.valueChanges.pipe(startWith(this.inputSig.range.lrv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = true;
      inputForm['lrvSl']?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });
    inputForm['lrv']?.statusChanges.pipe(distinctUntilChanged()).subscribe((v) => {
      if (v == 'VALID') {
        inputForm['urv']?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    });
    inputForm['lrvSl']?.valueChanges.pipe(startWith(this.inputSig.range.lrv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = true;
      inputForm['lrv']?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });
    inputForm['urv']?.valueChanges.pipe(startWith(this.inputSig.range.urv), pairwise()).subscribe(([vPrev, v]) => {
      inputForm['urvSl']?.setValue(v, { emitEvent: false });
      this.onSpanChange();
      this.lrvLast = false;
    });
    inputForm['urv']?.statusChanges.pipe(distinctUntilChanged()).subscribe((v) => {
      if (v == 'VALID') {
        inputForm['lrv']?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    });
    inputForm['urvSl']?.valueChanges.pipe(startWith(this.inputSig.range.urv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = false;
      inputForm['urv']?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });

    outputForm['output']?.valueChanges.subscribe((v) => {
      this.onSpanChange();
    });
    outputForm['sigType']?.valueChanges.subscribe((v) => {
      this.outputSig = { units: v, range: this.calcSpanService.getSignalParams(v) };
      this.onSigTypeChange(this.outputSig, { input: outputForm['lrv'], slider: outputForm['lrvSl'] }, { input: outputForm['urv'], slider: outputForm['urvSl'] });
      this.onSpanChange();
    });

    outputForm['lrv']?.valueChanges.pipe(startWith(this.outputSig.range.lrv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = true;
      outputForm['lrvSl']?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });
    outputForm['lrv']?.statusChanges.pipe(distinctUntilChanged()).subscribe((v) => {
      if (v == 'VALID') {
        outputForm['urv']?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    });

    outputForm['lrvSl']?.valueChanges.pipe(startWith(this.outputSig.range.lrv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = true;
      outputForm['lrv']?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });

    outputForm['urv']?.valueChanges.pipe(startWith(this.outputSig.range.urv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = false;
      outputForm['urvSl']?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });
    outputForm['urv']?.statusChanges.pipe(distinctUntilChanged()).subscribe((v) => {
      if (v == 'VALID') {
        outputForm['lrv']?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    });

    outputForm['urvSl']?.valueChanges.pipe(startWith(this.outputSig.range.urv), pairwise()).subscribe(([vPrev, v]) => {
      this.lrvLast = false;
      outputForm['urv']?.setValue(v, { emitEvent: false });
      this.onSpanChange();
    });

    this.spanCalcForm.controls['selectPrimary'].valueChanges.subscribe((s) => {
      if (s) {
        this.chartData.unitsX = this.outputSig.units;
        this.chartData.unitsY = this.inputSig.units;
        inputForm['input'].enable({ emitEvent: false });
        outputForm['output'].disable({ emitEvent: false });
        outputForm['output'].setValue('', { emitEvent: false });
      }
      else {
        this.chartData.unitsX = this.inputSig.units;
        this.chartData.unitsY = this.outputSig.units;
        inputForm['input'].disable({ emitEvent: false });
        outputForm['output'].enable({ emitEvent: false });
        inputForm['input'].setValue('', { emitEvent: false });
      };
      this.onSpanChange();
    });

    
    // this.inputRangesForm.controls['input'].setValidators([this.validateInput(inputRegex)]);
    // this.outputRangesForm.controls['output'].setValidators([this.validateInput(inputRegex)]);

    return this.spanCalcForm;
  }

  ngOnInit(): void {
    // this.spanCalcForm.controls['selectPrimary'].setValue(true);
    // this.updateSpan.next(this.getFormData());
  }

  // Custom validator function for input and output formgroup controls
  public validateRanges(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const lrvControls: { input: AbstractControl, slider: AbstractControl } = { input: control.get('lrv')!, slider: control.get('lrvSl')! };
      const urvControls: { input: AbstractControl, slider: AbstractControl } = { input: control.get('urv')!, slider: control.get('urvSl')! };

      let sig: typeof this.inputSig;
      let input: AbstractControl;

      // Identify whether it's the inputRangesForm or outputRangesForm group
      if (lrvControls.input.parent == this.inputRangesForm) {
        sig = this.inputSig;
        input = control.get('input')!;
      }
      else {
        sig = this.outputSig;
        input = control.get('output')!;
      };

      // First check if enabled and for null
      if (input.enabled && input.value) {
        if (input.value < lrvControls.input.value) {
          input.setValue(lrvControls.input.value);
        }
        else if (input.value > urvControls.input.value) {
          input.setValue(urvControls.input.value);
        }
      }

      // If LRV was the last control changed && LRV == URV
      if (lrvControls.input.value == urvControls.input.value) {
        lrvControls.input.markAsTouched();
        urvControls.input.markAsTouched();
        lrvControls.input.setErrors({ equal: true });
        urvControls.input.setErrors({ equal: true });
        lrvControls.slider.setErrors({ equal: true });
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

  public validateInteger(exp: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let val: string = control.value;
      let invalid: boolean = exp.test(val);

      if (invalid) {
        val = val.replace(exp, '');
        control.patchValue(val, {emitEvent: false});
      }
      return null;
    };
  };

  // Have each form control call this function with the 
  private onSpanChange() {
    this.updateSpan.next(this.getFormData());
  };

  private onSigTypeChange(sig: typeof this.inputSig, lrvControls: { input: AbstractControl, slider: AbstractControl }, urvControls: { input: AbstractControl, slider: AbstractControl }): void {
    if (lrvControls.input.value < sig.range.lrv || lrvControls.input.value > sig.range.urv) {
      lrvControls.input.setValue(sig.range.lrv);
    };
    if (urvControls.input.value > sig.range.urv || urvControls.input.value < sig.range.lrv) {
      urvControls.input.setValue(sig.range.urv);
    };
  };

  getFormData(): data {
    var dataObj: data;
    var inputPrim: boolean = this.spanCalcForm!.controls['selectPrimary'].value;
    var val: string = '';

    if (inputPrim) {
      val = this.inputRangesForm!.controls['input'].value;
    }
    else {
      val = this.outputRangesForm!.controls['output'].value;
    };
    let inputRng: range = {
      lrv: this.inputRangesForm!.controls['lrv'].value,
      urv: this.inputRangesForm!.controls['urv'].value
    };
    let outputRng: range = {
      lrv: this.outputRangesForm!.controls['lrv'].value,
      urv: this.outputRangesForm!.controls['urv'].value
    };
    var units = this.getUnits();
    dataObj = { prim: inputPrim, val: val, input: inputRng, output: outputRng, units: units }
    return dataObj;
  };

  getUnits(): { x: string, y: string } {
    let unitsX = this.spanCalcForm!.controls['selectPrimary'].value ? this.outputSig.units : this.inputSig.units;
    let unitsY = this.spanCalcForm!.controls['selectPrimary'].value ? this.inputSig.units : this.outputSig.units;
    let u: { x: string, y: string } = { x: unitsX, y: unitsY }
    return u;
  }

  // Passes Observable to component
  getData(): Observable<data> {
    return this.updateSpan.asObservable();
  }

}
