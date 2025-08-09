import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseMatchedJobs } from './browse-matched-jobs';

describe('BrowseMatchedJobs', () => {
  let component: BrowseMatchedJobs;
  let fixture: ComponentFixture<BrowseMatchedJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseMatchedJobs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseMatchedJobs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
