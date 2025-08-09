import { TestBed } from '@angular/core/testing';

import { JobMatching } from './job-matching';

describe('JobMatching', () => {
  let service: JobMatching;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobMatching);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
