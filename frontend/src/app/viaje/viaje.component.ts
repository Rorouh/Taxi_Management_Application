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
  esperandoCliente = true;    // esperando que cliente confirme «en progreso»
  viajeEnCurso     = false;   // conductor pulsó «Iniciar»
  viajeTerminado   = false;   // viaje cerrado
  titulo           = 'Esperando a que el cliente acepte…';
  finalizado       = false;

  // minutos de retraso que introduce el conductor
  delayMinutes = 0;

  private poller!: ReturnType<typeof setInterval>;

  constructor(
    private viajeSrv  : ViajeService,
    private pedidoSrv : PedidoService,
    private route     : ActivatedRoute,
    private router    : Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.viajeSrv.getViajeID(id).subscribe(v => {
      this.viaje = v;
      this.startPollingPedido();
    });
  }

  /** CLIENTE ACEPTA EL VIAJE */
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

  /** CONDUCTOR INICIA EL VIAJE */
  iniciarViaje(): void {
    this.viajeEnCurso = true;
    this.titulo = 'Viaje en curso · pulsa “Finalizar viaje” cuando llegues';

    // hora real de inicio
    this.viaje.inicio = new Date();
  }

  /** CONDUCTOR FINALIZA EL VIAJE (con ajuste de retraso) */
  finalizarViaje(): void {
    // Ajustamos la hora de fin según el retraso
    const ahora = new Date();
    const finAjustado = new Date(ahora.getTime() + this.delayMinutes * 60_000);
    // Ajustamos también la hora de inicio (para guardar el retraso en todo el viaje)
    this.viaje.inicio = new Date(this.viaje.inicio.getTime() + this.delayMinutes * 60_000);

    // simplificación: kilometraje previsto
    const km = this.viaje.pedido.distancia;

    this.viajeSrv.finalizarViaje(this.viaje._id || '', {
      kilometros: km,
      fin: finAjustado.toISOString()
    }).subscribe({
      next: (v) => {
        this.viaje      = v;
        this.finalizado = true;
        this.titulo     = 'Viaje finalizado — gracias';
      },
      error: (err) => console.error(err)
    });
  }

  aplicarRetraso(): void {
    if (!this.viaje.inicio || !this.viaje.fin) return;

    const retrasoMs = this.delayMinutes * 60_000;
    // movemos la hora de inicio y fin
    this.viaje.inicio = new Date(new Date(this.viaje.inicio).getTime() + retrasoMs);
    this.viaje.fin    = new Date(new Date(this.viaje.fin)   .getTime() + retrasoMs);

    // opcional: actualizar el título para reflejar el retraso
    this.titulo = `Retraso aplicado: +${this.delayMinutes} min`;
  }

  ngOnDestroy(): void {
    clearInterval(this.poller);
  }
}
