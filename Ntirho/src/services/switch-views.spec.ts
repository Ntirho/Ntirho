import { TestBed } from '@angular/core/testing';

import { SwitchViews } from './switch-views';

describe('SwitchViews', () => {
  let service: SwitchViews;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwitchViews);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
