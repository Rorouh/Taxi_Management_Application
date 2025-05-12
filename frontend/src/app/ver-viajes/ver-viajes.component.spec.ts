import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerViajesComponent } from './ver-viajes.component';

describe('VerViajesComponent', () => {
  let component: VerViajesComponent;
  let fixture: ComponentFixture<VerViajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerViajesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerViajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
