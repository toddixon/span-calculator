import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  isPrinting: boolean = false;

  private graphData = new Subject<HTMLCanvasElement|null>;
  public graphData$ = this.graphData.asObservable();

  constructor() { }

  // Called when user clicks print button in the app.component template. 
  printGraph(canvasCopy: HTMLCanvasElement, canvasOriginal: HTMLCanvasElement) {
    this.isPrinting = true;
    this.setCanvas(canvasCopy, canvasOriginal);
    this.onDataReady();
  };

  saveGraph(){
    // let data: HTMLElement = document.getElementById('myChart')!;
    let data: HTMLElement = document.getElementById('print')!;    
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf: jsPDF = this.generatePdf(); // pass in "p" for portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);
      pdf.save('filename.pdf');
    })
  }

  sendData(data: HTMLCanvasElement | null): void {
    this.graphData.next(data);
  };

  generatePdf(orentation: "l" | "p" | "portrait" | "landscape" | undefined = 'l', ): jsPDF {
    return new jsPDF(orentation, 'cm', 'a4');
  };

  onDataReady() {
    setTimeout(() => {
      window.print();
    }, 2000)
    this.isPrinting = false;
  };

  setCanvas(canvasCopy: HTMLCanvasElement, canvasOriginal: HTMLCanvasElement): void {
    let dWidth: number = canvasCopy.width; // Horizontal scaling of printed canvas
    let dHeight = this.scaleH(dWidth, canvasCopy); // Vertical scaling of printed canvas
    let ctx = canvasCopy.getContext('2d')!;

    ctx.clearRect(0, 0, canvasCopy.width, canvasCopy.height);
    ctx.drawImage(canvasOriginal, 0, 0, dWidth, dHeight);
    return
  }

  scaleH(dWidth: number, canvas: HTMLCanvasElement): number {
    let dHeight: number;
    let height: number = canvas.height;
    let width: number = canvas.width;
    dHeight = dWidth * height / width;
    return dHeight;
  }

}
