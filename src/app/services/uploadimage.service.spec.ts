import { TestBed } from '@angular/core/testing';

import { UploadimageService } from './uploadimage.service';

describe('UploadimageService', () => {
  let service: UploadimageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadimageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
