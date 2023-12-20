import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  isPrinting = false;

  private graphData = new BehaviorSubject<Chart|null>(null);
  graphData$ = this.graphData.asObservable();  


  constructor(private router: Router) { }

  getChart(chart: Chart) {
    this.graphData.next(chart);
  }

  // Called when user clicks print button in the app.component template. 
  printGraph() {
    this.isPrinting = true;
    this.router.navigate(['/', 
      { outlets: {
        'print': ['print']
      }}
  ])
  };

  onDataReady() {
    window.print();
    this.isPrinting = false;

  };


}
