import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchedJobCard } from './matched-job-card';

describe('MatchedJobCard', () => {
  let component: MatchedJobCard;
  let fixture: ComponentFixture<MatchedJobCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchedJobCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchedJobCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
