import { Injectable, booleanAttribute } from '@angular/core';
import { Subject } from 'rxjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  isPrinting = false;
  isSaving = false;
  htmlImage: string = null!;
  private graphData = new Subject<HTMLCanvasElement | null>;
  public graphData$ = this.graphData.asObservable();

  // Called when user clicks print button in the app.component template. 
  printGraph(canvasCopy: HTMLCanvasElement, canvasOriginal: HTMLCanvasElement): void {
    this.setCanvas(canvasCopy, canvasOriginal);
    this.onDataReady();
  }

  saveGraph(canvasCopy: HTMLCanvasElement, canvasOriginal: HTMLCanvasElement): void {
    const data: HTMLElement = document.getElementById('print')!;
    this.setCanvas(canvasCopy, canvasOriginal);
    this.setSaveStyle(data, true);

    html2canvas(data).then(img => {
      const contentDataURL = img.toDataURL('image/png');
      this.htmlImage = contentDataURL;
      const pdf: jsPDF = this.generatePdf('p'); // pass in "p" for portrait mode
      pdf.addImage(contentDataURL, 'PNG', 0, 1, 21, 29.7);// 21 x 29.7 = Portrait A4 W x H
      pdf.save('spanCalc.pdf');
      this.setSaveStyle(data, false);
    })

    return;
  }

  setSaveStyle(element: HTMLElement, active: boolean): void {
    const styleActive = 'display:flex; width:21cm; height:29.7cm; margin-top:0.5cm; justify-content: center; align-items: flex-start;';
    const styleInactive = 'width:100%; height:100%; margin-top:unset;';
    element.setAttribute('style', active? styleActive : styleInactive);
    return;
  }

  sendData(data: HTMLCanvasElement | null): void {
    this.graphData.next(data);
  }

  generatePdf(orientation: "l" | "p" | "portrait" | "landscape" | undefined = 'p',): jsPDF {
    return new jsPDF(orientation, 'cm', 'a4')
  }

  onDataReady() {
    setTimeout(() => {
      window.print();
    }, 1000)
    this.isPrinting = false;
  }

  setCanvas(canvasCopy: HTMLCanvasElement, canvasOriginal: HTMLCanvasElement): void {
    const dWidth: number = canvasCopy.width; // Horizontal scaling of printed canvas
    const dHeight = this.scaleH(dWidth, canvasCopy); // Vertical scaling of printed canvas
    const ctx = canvasCopy.getContext('2d')!;
    ctx.clearRect(0, 0, canvasCopy.width, canvasCopy.height);
    ctx.drawImage(canvasOriginal, 0, 0, dWidth, dHeight); //drawImage(image, dx, dy, dWidth, dHeight) 
    return;
  }

  scaleH(dWidth: number, canvas: HTMLCanvasElement): number {
    let dHeight: number;
    const height: number = canvas.height;
    const width: number = canvas.width;
    dHeight = dWidth * height / width;
    return dHeight;
  }

}
