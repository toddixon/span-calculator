import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPrintComponent } from './graph-print.component';

describe('GraphPrintComponent', () => {
  let component: GraphPrintComponent;
  let fixture: ComponentFixture<GraphPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraphPrintComponent]
    });
    fixture = TestBed.createComponent(GraphPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
