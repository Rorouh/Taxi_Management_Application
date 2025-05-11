// src/app/esperar-pedido/esperar-pedido.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { Pedido, PedidoService } from '../services/pedido.service';
import { Viaje, ViajeService   } from '../services/viaje.service';

@Component({
  selector   : 'app-esperar-pedido',
  standalone : false,
  templateUrl: './esperar-pedido.component.html',
  styleUrls  : ['./esperar-pedido.component.css']
})
export class EsperarPedidoComponent implements OnInit, OnDestroy {

  pedido: Pedido = {
    _id        : '',
    cliente    : {} as any,
    origen     : { calle:'', numero:'', codigoPostal:'', localidad:'', latitud:0, longitud:0 },
    destino    : { calle:'', numero:'', codigoPostal:'', localidad:'', latitud:0, longitud:0 },
    numPersonas: 1,
    estado     : 'pendiente',
    confort    : '',
    distancia  : 0,
    tiempo     : 0
  };

  viaje: Viaje | null = null;
  conductorEncontrado = false;

  private sub?: Subscription;

  constructor(
    private pedidoSrv : PedidoService,
    private viajeSrv  : ViajeService,
    private route     : ActivatedRoute,
    private router    : Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;

    // 1. Cargar pedido una vez
    this.pedidoSrv.getPedidoId(id).subscribe({
      next : p   =>  this.pedido = p,
      error: err =>  console.error(err)
    });

    // 2. Polling cada 5s hasta que el pedido sea 'aceptado'
    this.sub = interval(5000).pipe(
      switchMap(() => this.pedidoSrv.getPedidoId(id))
    ).subscribe({
      next : p => {
        this.pedido = p;
        if (p.estado === 'aceptado') {
          this.obtenerViaje(id);
        }
      },
      error: err => console.error('Polling pedido:', err)
    });
  }

  private obtenerViaje(id: string): void {
    this.viajeSrv.getViajeIdPedido(id).subscribe({
      next: v => {
        // recalcular minutos totales entre inicio y fin
        const inicioMs = new Date(v.inicio).getTime();
        const finMs    = new Date(v.fin).getTime();
        v.tiempoTotal  = Math.round((finMs - inicioMs) / 60000);

        this.viaje = v;
        this.conductorEncontrado = true;
        this.sub?.unsubscribe();
      },
      error: err => console.error(err)
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    // si el usuario cierra antes de que se acepte, auto-cancel
    if (this.pedido.estado === 'pendiente') {
      this.cancelarPedido();
    }
  }

  cancelarPedido(): void {
    this.pedidoSrv.cambiarEstadoPedido(this.pedido._id || '', 'cancelado').subscribe({
      next : () => this.router.navigate(['/pedido', this.pedido.cliente.nif]),
      error: err  => console.error(err)
    });
  }

  aceptarPedido(): void {
    this.pedidoSrv.cambiarEstadoPedido(this.pedido._id || '', 'en progreso').subscribe({
      next : ()   => this.pedido.estado = 'en progreso',
      error: err  => console.error(err)
    });
  }
}
