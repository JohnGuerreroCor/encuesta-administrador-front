import { TestBed } from '@angular/core/testing';

import { UaaService } from './uaa.service';

describe('UaaService', () => {
  let service: UaaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UaaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
