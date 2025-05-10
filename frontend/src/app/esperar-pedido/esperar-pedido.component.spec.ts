import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsperarPedidoComponent } from './esperar-pedido.component';

describe('EsperarPedidoComponent', () => {
  let component: EsperarPedidoComponent;
  let fixture: ComponentFixture<EsperarPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EsperarPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsperarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
