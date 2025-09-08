import { TestBed } from '@angular/core/testing';

import { SepediASR } from './sepedi-asr';

describe('SepediASR', () => {
  let service: SepediASR;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SepediASR);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
