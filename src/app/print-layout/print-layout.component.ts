import { Component, OnInit } from '@angular/core';
import { PrintService } from '../print.service';

// Route: `/(print:print)`
@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.scss']
})
export class PrintLayoutComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {

  }

}
