import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpanGraphComponent } from './span-graph.component';

describe('SpanGraphComponent', () => {
  let component: SpanGraphComponent;
  let fixture: ComponentFixture<SpanGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpanGraphComponent]
    });
    fixture = TestBed.createComponent(SpanGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
