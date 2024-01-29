import { Injectable } from '@angular/core';
import { range } from './range';
import { point } from './point';
import { signalPresets } from './signal-presets';

@Injectable({
  providedIn: 'root'
})
export class CalcSpanService {
  constructor() { };

  // Returns an array of keys from this.signalPresets dictionary
  getSigTypes(): String[] {
    return Object.keys(signalPresets)
  };

  // Returns range interface object with 2 parameters {lrv: number, urv: number} 
  getSignalParams(key: string): range {
    return signalPresets[key]
  };

  calcSpan(input: range, output: range, inputPrim: boolean,  val: string = '', pointCount: number = 10,): [Array<point>, point] {
    let primaryRng: range;
    let secondaryRng: range;
    let calcVal: point | undefined = undefined;
    // Ternary operator that switches the primary signal (y) based on inputPrim (controlled by input/output radio static buttons in app.component) 
    inputPrim ? [primaryRng, secondaryRng] = [input, output] : [primaryRng, secondaryRng] = [output, input]

    let primaryPts: Array<number> = [];
    let secondaryPts: Array<number> = [];
    let points: Array<point> = [];

    secondaryPts = this.interpolateSecondaryRng(secondaryRng, pointCount);
    
    // Calculate primary points
    let mPri: number = primaryRng.urv - primaryRng.lrv; // Slope for primary range 
    let mSec: number = secondaryRng.urv - secondaryRng.lrv; // Slope for secondary range
    for (let i = 0; i < secondaryPts.length; i++) {
      primaryPts.push(
        this.calcPrimaryPoint(primaryRng, secondaryRng, secondaryPts[i], mPri, mSec)
        )
      };
    //primaryPts = this.calcPrimaryPoints(primaryRng, secondaryRng, secondaryPts, val);
    if (!isNaN(parseFloat(val))){
      calcVal = this.calcVal(primaryRng, secondaryRng, val, mPri, mSec);
    };
    
    // Map number arrays into one array of points objects 
    points = primaryPts.map((x, i) => {
      // Round to nearest 1/100th 
      x = this.roundNum(x);
      let y = this.roundNum(secondaryPts[i]);
      return { x: x, y: y };
    })
    return [points, calcVal!];
  };

  private roundNum(num: number, precision: number = 3) {
    return parseFloat(num.toFixed(precision));
  };

  private calcPrimaryPoint(primaryRng: range, secondaryRng: range, secondaryPoint: number, mPri: number, mSec: number): number {
    let v = (((secondaryPoint - secondaryRng.lrv) / mSec) * mPri) + primaryRng.lrv;
    return v;
  };
  // Calculates the secondary point value with a given primary point value 
  private calcVal(primaryRng: range, secondaryRng: range, val: string, mPri: number, mSec: number): point {
    let valFl: number = parseFloat(val);
    let valPoint: point; 
    let sec: number = (((valFl - primaryRng.lrv) / mPri) * mSec) + secondaryRng.lrv;
    sec = this.roundNum(sec);
    valPoint = {x: valFl, y: sec};
    return valPoint;
  };

  private interpolateSecondaryRng(range: range, pointCount: number): Array<number> {
    let rngStart: number = range.lrv;
    let rngEnd: number = range.urv;
    let secondaryPts: Array<number> = [];

    for (let i = 0; i <= pointCount; i++) {
      secondaryPts.push(
        (rngStart + (rngEnd - rngStart) * (i / (pointCount)))
      )
    };
    return secondaryPts;
  };
}