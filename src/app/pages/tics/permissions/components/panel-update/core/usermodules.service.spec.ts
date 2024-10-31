import { TestBed } from '@angular/core/testing';

import { UsermodulesService } from './usermodules.service';

describe('UsermodulesService', () => {
  let service: UsermodulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsermodulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
