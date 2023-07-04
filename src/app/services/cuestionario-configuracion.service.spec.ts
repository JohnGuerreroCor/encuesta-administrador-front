import { TestBed } from '@angular/core/testing';

import { CuestionarioConfiguracionService } from './cuestionario-configuracion.service';

describe('CuestionarioConfiguracionService', () => {
  let service: CuestionarioConfiguracionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuestionarioConfiguracionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
