import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AceptarPedidosComponent } from './aceptar-pedidos.component';

describe('AceptarPedidosComponent', () => {
  let component: AceptarPedidosComponent;
  let fixture: ComponentFixture<AceptarPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AceptarPedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AceptarPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
