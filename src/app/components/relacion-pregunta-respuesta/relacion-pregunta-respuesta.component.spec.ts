import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionPreguntaRespuestaComponent } from './relacion-pregunta-respuesta.component';

describe('RelacionPreguntaRespuestaComponent', () => {
  let component: RelacionPreguntaRespuestaComponent;
  let fixture: ComponentFixture<RelacionPreguntaRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelacionPreguntaRespuestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelacionPreguntaRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
