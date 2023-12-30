import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpanResultComponent } from './span-result.component';

describe('SpanResultComponent', () => {
  let component: SpanResultComponent;
  let fixture: ComponentFixture<SpanResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpanResultComponent]
    });
    fixture = TestBed.createComponent(SpanResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
