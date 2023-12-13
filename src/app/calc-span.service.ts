import { Injectable, OnDestroy, OnInit } from '@angular/core';

import { range } from './range';
import { point } from './point';

@Injectable({
  providedIn: 'root'
})
export class CalcSpanService {
  signalTypes: { [sigId: string]: range; }={};
  
  constructor() {

    this.signalTypes["milliamps"] = {lrv: 4, urv:20}
    this.signalTypes["ma1"] = {lrv: 0, urv:20}
    this.signalTypes["voltage"] = {lrv: 0, urv:10}
    this.signalTypes["v1"] = {lrv: 2, urv:10}
  }

  // Returns an array of keys from this.signalTypes dictionary
  getSigTypes(): String[] {
    return Object.keys(this.signalTypes)
  }

  // Returns range interface object with 2 parameters {lrv: number, urv: number} 
  getSignalParams(key: string): range {
    return this.signalTypes[key]
  }

  getSpan(input: number, type: string){
    let m = this.signalTypes[type]
  }

  calcSpan(input: range, output: range, inputPrim: boolean, pointCount: number = 10): Array<point> {
    //const spanFn = inputPrim ? this.getSpanFn(input) : this.getSpanFn(output);// inputPrim: Determines which signal (input, or output) is the primary signal: True = Input, False = Output
    let primaryRng: range;
    let secondaryRng: range;

    // Ternary operator that switches the primary signal (y) based on inputPrim (controlled by input/output radio static buttons in app.component) 
    inputPrim ? [primaryRng, secondaryRng] = [input, output] : [primaryRng, secondaryRng] = [output, input]

    let primaryPts: Array<number> = [];
    let secondaryPts: Array<number> = [];
    let points: Array<point> = [];// points = [{x: secondaryPts[i], y: primaryPts[i]}, ...]
    
    secondaryPts = this.interpolateSecondaryRng(secondaryRng, pointCount);
    primaryPts = this.calcPrimaryPoints(primaryRng, secondaryRng, secondaryPts);//this.getPrimaryPts(primaryRng, secondaryPts);

    points = primaryPts.map((x, i) => {
      // Round to nearest 1/100th 
      x = this.roundNum(x);
      let y = this.roundNum(secondaryPts[i]);
      return {x: x, y: y};
    })
    //console.log(points);
    return points;
  };

  private roundNum(num: number, precision: number = 3){
    //return (Math.round(num * 1000) / 1000)
    return parseFloat(num.toFixed(precision));
  };

  private calcPrimaryPoints(primaryRng: range, secondaryRng: range, secondaryPoints: Array<number>): Array<number> {
    // primaryPoint = (((secondaryPoint - LRV_out)/slopeSec) * slopePri) + LRV_in
    
    let primaryPts: Array<number> = [];

    let slopePri: number = primaryRng.urv - primaryRng.lrv;
    let slopeSec: number =  secondaryRng.urv - secondaryRng.lrv;

    for (let i = 0; i < secondaryPoints.length; i++) {
      primaryPts.push(
        (((secondaryPoints[i] - secondaryRng.lrv)/slopeSec) * slopePri) + primaryRng.lrv
      )
    }

    return primaryPts
  }


  private interpolateSecondaryRng(range: range, pointCount: number): Array<number>{
    let rngStart: number = range.lrv;
    let rngEnd: number = range.urv;
    let secondaryPts: Array<number> = [];

    for (let i=0; i < pointCount; i++){
      secondaryPts.push(
        (rngStart + (rngEnd - rngStart) * (i / (pointCount)))
      )
    }
  
    return secondaryPts;
  }
}