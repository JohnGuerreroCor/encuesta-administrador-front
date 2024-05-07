import { TestBed } from '@angular/core/testing';

import { ReporteEncuestaAgrupadoExcelService } from './reporte-encuesta-agrupado-excel.service';

describe('ReporteEncuestaAgrupadoExcelService', () => {
  let service: ReporteEncuestaAgrupadoExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteEncuestaAgrupadoExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
