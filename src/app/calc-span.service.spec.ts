import { TestBed } from '@angular/core/testing';

import { CalcSpanService } from './calc-span.service';

describe('CalcSpanService', () => {
  let service: CalcSpanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalcSpanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
