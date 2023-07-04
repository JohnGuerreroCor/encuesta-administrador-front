import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalaLikertComponent } from './escala-likert.component';

describe('EscalaLikertComponent', () => {
  let component: EscalaLikertComponent;
  let fixture: ComponentFixture<EscalaLikertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EscalaLikertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscalaLikertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
