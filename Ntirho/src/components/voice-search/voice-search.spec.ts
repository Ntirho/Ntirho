import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceSearch } from './voice-search';

describe('VoiceSearch', () => {
  let component: VoiceSearch;
  let fixture: ComponentFixture<VoiceSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoiceSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
