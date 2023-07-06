import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrupadoComponent } from './agrupado.component';

describe('AgrupadoComponent', () => {
  let component: AgrupadoComponent;
  let fixture: ComponentFixture<AgrupadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgrupadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgrupadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
