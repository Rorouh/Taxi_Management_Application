import { Component, OnDestroy, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { Viaje, ViajeService } from '../services/viaje.service';
import { PedidoService } from '../services/pedido.service';

@Component({
  selector   : 'app-viaje',
  standalone: false,
  templateUrl: './viaje.component.html',
  styleUrls  : ['./viaje.component.css']
})
export class ViajeComponent implements OnInit, OnDestroy {
  viaje: Viaje = {} as Viaje;

  // estado UI
  esperandoCliente = true;   // esperando que cliente confirme «en progreso»
  viajeEnCurso      = false; // conductor pulsó «Iniciar»
  viajeTerminado    = false; // conductor pulsó «Finalizar»
  titulo            = 'Esperando a que el cliente acepte…';
  finalizado = false;

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

  /** ---------- CLIEN­­TE ACEPTA EL VIAJE ---------- */
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

  /** ---------- CONDUCTOR INICIA EL VIAJE ---------- */
  iniciarViaje(): void {
    this.viajeEnCurso = true;
    this.titulo = 'Viaje en curso · pulsa “Finalizar viaje” cuando llegues';
    // hora real de inicio
    this.viaje.inicio = new Date();
  }

  /** ---------- CONDUCTOR FINALIZA EL VIAJE ---------- */
  finalizarViaje() {
    // opcional: obtener geo-localización para km reales
    navigator.geolocation.getCurrentPosition(
      pos => {
        const km = this.viaje.pedido.distancia;      // simplificación: ya lo tenéis calculado
        this.viajeSrv.finalizarViaje(this.viaje._id || '', {
          kilometros: km,
          fin: new Date().toISOString()
        }).subscribe({
          next: (v) => {
            this.viaje       = v;
            this.finalizado  = true;
            this.titulo      = 'Viaje finalizado — gracias';
          },
          error: (err) => console.error(err)
        });
      },
      _err => {
        // si no hay geoloc usamos igual los km previstos
        const km = this.viaje.pedido.distancia;
        this.viajeSrv.finalizarViaje(this.viaje._id || '', {
          kilometros: km,
          fin: new Date().toISOString()
        }).subscribe(/* … mismo callback … */);
      }
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.poller);
  }
}
