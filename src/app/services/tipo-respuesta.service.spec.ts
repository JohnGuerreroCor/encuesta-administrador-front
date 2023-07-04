import { TestBed } from '@angular/core/testing';

import { TipoRespuestaService } from './tipo-respuesta.service';

describe('TipoRespuestaService', () => {
  let service: TipoRespuestaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoRespuestaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
