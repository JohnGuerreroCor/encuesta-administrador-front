import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevisualizacionComponent } from './previsualizacion.component';

describe('PrevisualizacionComponent', () => {
  let component: PrevisualizacionComponent;
  let fixture: ComponentFixture<PrevisualizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrevisualizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevisualizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
