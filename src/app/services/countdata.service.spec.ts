import { TestBed } from '@angular/core/testing';

import { CountdataService } from './countdata.service';

describe('CountdataService', () => {
  let service: CountdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
