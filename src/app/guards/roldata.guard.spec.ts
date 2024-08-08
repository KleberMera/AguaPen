import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roldataGuard } from './roldata.guard';

describe('roldataGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roldataGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
