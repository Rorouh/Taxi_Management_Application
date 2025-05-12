// src/app/viaje/viaje.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Viaje, ViajeService } from '../services/viaje.service';
import { PedidoService } from '../services/pedido.service';

@Component({
  selector   : 'app-viaje',
  standalone : false,
  templateUrl: './viaje.component.html',
  styleUrls  : ['./viaje.component.css']
})
export class ViajeComponent implements OnInit, OnDestroy {
  viaje: Viaje = {} as Viaje;

  // estado UI
  esperandoCliente = true;
  viajeEnCurso     = false;
  viajeTerminado   = false;
  titulo           = 'Esperando a que el cliente acepte…';
  finalizado       = false;

  delayMinutes = 0;
  advanceMinutes = 0;

  private poller!: ReturnType<typeof setInterval>;

  constructor(
    private viajeSrv  : ViajeService,
    private pedidoSrv : PedidoService,
    private route     : ActivatedRoute,
    private router    : Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.viajeSrv.getViajeID(id).subscribe(data => {
      // Convertimos strings a Date
      data.inicio = new Date(data.inicio as any);
      data.fin    = new Date(data.fin as any);
      this.viaje = data;
      this.startPollingPedido();
    });
  }

  private startPollingPedido(): void {
    this.poller = setInterval(() => {
      this.pedidoSrv.getPedidoId(this.viaje.pedido._id || '').subscribe(p => {
        if (p.estado === 'en progreso') {
          this.esperandoCliente = false;
          this.titulo = 'Cliente a bordo · pulsa “Iniciar viaje”';
          clearInterval(this.poller);
        }
        if (p.estado === 'cancelado') {
          this.titulo = 'El cliente canceló el viaje';
          clearInterval(this.poller);
        }
      });
    }, 5_000);
  }

  iniciarViaje(): void {
    this.viajeEnCurso = true;
    this.titulo = 'Viaje en curso · ajusta duración o pulsa “Finalizar”';
    this.viaje.inicio = new Date();
    this.viaje.fin    = new Date(this.viaje.inicio.getTime() + this.viaje.tiempoTotal * 60_000);
  }

  aplicarRetraso(): void {
    if (this.delayMinutes <= 0) return;
    this.viaje.tiempoTotal += this.delayMinutes;
    this.viaje.fin = new Date(this.viaje.inicio.getTime() + this.viaje.tiempoTotal * 60_000);
    this.titulo = `Retraso aplicado: +${this.delayMinutes} min (total ${this.viaje.tiempoTotal} min)`;
  }

  aplicarAdelanto(): void {
    if (this.advanceMinutes <= 0) return;
    this.viaje.tiempoTotal = Math.max(0, this.viaje.tiempoTotal - this.advanceMinutes);
    this.viaje.fin = new Date(this.viaje.inicio.getTime() + this.viaje.tiempoTotal * 60_000);
    this.titulo = `Adelanto aplicado: –${this.advanceMinutes} min (total ${this.viaje.tiempoTotal} min)`;
  }

finalizarViaje(): void {
  const km = this.viaje.pedido.distancia;
  this.viajeSrv.finalizarViaje(this.viaje._id || '', {
    kilometros: km,
    fin: this.viaje.fin.toISOString()
  }).subscribe({
    next: data => {
      data.inicio = new Date(data.inicio as any);
      data.fin    = new Date(data.fin   as any);
      this.viaje = data;
      this.finalizado = true;
      this.viajeTerminado = true;
      this.titulo = 'Viaje finalizado — gracias';
    },
    error: err => console.error('Error al finalizar viaje:', err)
  });
}

  ngOnDestroy(): void {
    clearInterval(this.poller);
  }
}
