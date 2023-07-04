import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoLikertComponent } from './grupo-likert.component';

describe('GrupoLikertComponent', () => {
  let component: GrupoLikertComponent;
  let fixture: ComponentFixture<GrupoLikertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrupoLikertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoLikertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
