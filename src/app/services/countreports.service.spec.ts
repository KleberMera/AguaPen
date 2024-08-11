import { TestBed } from '@angular/core/testing';

import { CountreportsService } from './countreports.service';

describe('CountreportsService', () => {
  let service: CountreportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountreportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
