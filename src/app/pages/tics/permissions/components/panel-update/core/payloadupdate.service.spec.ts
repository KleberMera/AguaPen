import { TestBed } from '@angular/core/testing';

import { PayloadupdateService } from './payloadupdate.service';

describe('PayloadupdateService', () => {
  let service: PayloadupdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayloadupdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
