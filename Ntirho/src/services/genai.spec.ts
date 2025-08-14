import { TestBed } from '@angular/core/testing';

import { Genai } from './genai';

describe('Genai', () => {
  let service: Genai;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Genai);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
