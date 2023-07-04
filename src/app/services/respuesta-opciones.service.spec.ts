import { TestBed } from '@angular/core/testing';

import { RespuestaOpcionesService } from './respuesta-opciones.service';

describe('RespuestaOpcionesService', () => {
  let service: RespuestaOpcionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RespuestaOpcionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
