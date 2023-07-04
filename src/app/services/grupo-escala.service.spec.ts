import { TestBed } from '@angular/core/testing';

import { GrupoEscalaService } from './grupo-escala.service';

describe('GrupoEscalaService', () => {
  let service: GrupoEscalaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrupoEscalaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
