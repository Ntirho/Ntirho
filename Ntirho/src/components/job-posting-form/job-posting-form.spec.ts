import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostingForm } from './job-posting-form';

describe('JobPostingForm', () => {
  let component: JobPostingForm;
  let fixture: ComponentFixture<JobPostingForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobPostingForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPostingForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
