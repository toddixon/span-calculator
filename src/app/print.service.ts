import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { Chart } from 'chart.js';

import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

import { chartImg } from './chartImg';
import { ChartService } from './chart.service';


@Injectable({
  providedIn: 'root'
})
export class PrintService {
  isPrinting: boolean = false;
  chart?: Chart;
  chartCopy?: Chart<any>;
  chartStr: string = '';
  chartImg: string = chartImg;

  private graphData = new BehaviorSubject<Chart|null>(null);
  graphData$ = this.graphData.asObservable();  

  constructor(
    private router: Router,
    private chartService: ChartService) { }

  //@HostListener('window:onbeforeprint', ['$event'])

  // Called when user clicks print button in the app.component template. 
  printGraph() {
    this.isPrinting = true;
    this.chartStr = this.chartService.getChartStr();
    this.onDataReady();    

  };
  saveGraph(){
    let data: HTMLElement = document.getElementById('MyChart')!;
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf: jsPDF = this.gneeratePdf(); // pass in "p" for portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);
      pdf.save('filename.pdf');
    })


  }

  gneeratePdf(orentation: "l" | "p" | "portrait" | "landscape" | undefined = 'l', ): jsPDF {
    return new jsPDF(orentation, 'cm', 'a4');
  }

  onDataReady() {
    window.print();
    this.isPrinting = false;

  };


}
