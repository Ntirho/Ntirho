import { TestBed } from '@angular/core/testing';

import { WebkitASR } from './webkit-asr';

describe('WebkitASR', () => {
  let service: WebkitASR;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebkitASR);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
