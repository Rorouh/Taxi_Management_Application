import { Component, OnInit } from '@angular/core';
import { Pedido, PedidoService } from '../services/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Turno, TurnoService } from '../services/turno.service';
import { Viaje, ViajeService } from '../services/viaje.service';
import { PrecioService, Simulacion } from '../services/precio.service';

interface ViajeFront {
  pedido: string;
  turno: string;
  distanciaCliente: number;
  tiempoTotal: number;
  inicio: Date;
  fin: Date;
  precio: number;
}

@Component({
  selector: 'app-aceptar-pedidos',
  standalone: false,
  templateUrl: './aceptar-pedidos.component.html',
  styleUrls: ['./aceptar-pedidos.component.css']
})
export class AceptarPedidosComponent implements OnInit {
  viajeFront: ViajeFront = {
    pedido: '',
    turno: '',
    distanciaCliente: 0,
    tiempoTotal: 0,
    inicio: new Date(),
    fin: new Date(),
    precio: 0
  };

  simulacion: Simulacion = {
    nivelConfort: 'basico',
    inicio: '',
    fin: ''
  };

  lat = 38.756734;
  lng = -9.155412;

  turnoActual: Turno | null = null;
  noDisponible = false;
  viajes: Viaje[] = [];

  constructor(
    private turnoService: TurnoService,
    private pedidoService: PedidoService,
    private precioService: PrecioService,
    private viajeService: ViajeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nif = this.route.snapshot.paramMap.get('nif') || '';
    this.turnoService.getTurnosConductor(nif).subscribe({
      next: turnos => {
        this.turnoActual = turnos.find(turno => {
          const inicio = new Date(turno.inicio).getTime();
          const fin    = new Date(turno.fin).getTime();
          return inicio < Date.now() && Date.now() < fin;
        }) || null;

        if (!this.turnoActual) {
          this.noDisponible = true;
          return;
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            pos => {
              this.lat = pos.coords.latitude;
              this.lng = pos.coords.longitude;
              this.obtenerListaViajes();
            },
            err => {
              console.warn('Geoloc denegada o fallida:', err);
              this.obtenerListaViajes();
            }
          );
        } else {
          this.obtenerListaViajes();
        }
      },
      error: err => {
        console.error('Error al cargar turnos:', err);
        this.noDisponible = true;
      }
    });
  }


  aceptarPedido(v: Viaje): void {
    this.pedidoService.cambiarEstadoPedido(v.pedido._id || '', 'aceptado')
      .subscribe({
        next: () => {
          // Preparamos simulación y viaje
          this.viajeFront = {
            pedido: v.pedido._id || '',
            turno:  v.turno._id || '',
            distanciaCliente: v.distanciaCliente,
            tiempoTotal:      v.tiempoTotal,
            inicio:           new Date(),
            fin:              v.fin,
            precio:           0
          };

          this.simulacion.nivelConfort = this.turnoActual!.taxi.nivelConfort;
          this.simulacion.inicio       = this.viajeFront.inicio.toISOString();
          this.simulacion.fin          = this.viajeFront.fin.toISOString();

          // Simular coste
          this.precioService.simularCoste(this.simulacion).subscribe({
            next: res => {
              this.viajeFront.precio = res.coste;
              // Registrar viaje real
              this.viajeService.registrarViaje(this.viajeFront).subscribe({
                next: real => this.router.navigate(['/viaje', real._id]),
                error: err => console.error('Error al registrar viaje:', err)
              });
            },
            error: err => console.error('Error al simular coste:', err)
          });
        },
        error: err => console.error('Error cambiar estado pedido:', err)
      });
  }

  private obtenerListaViajes(): void {
    // Protección en caso de turnoActual nulo
    if (!this.turnoActual) {
      this.noDisponible = true;
      return;
    }

    const nivel = this.turnoActual.taxi.nivelConfort;
    this.pedidoService.getPedidosDisponibles(nivel).subscribe({
      next: pedidos => {
        const ahora = Date.now();
        const finTurno = new Date(this.turnoActual!.fin).getTime();
        this.viajes = [];

        for (const pedido of pedidos) {
          // Calculamos distancia y tiempo hasta cliente
          const { distancia, tiempo } = this.calcularTiempoCliente(pedido);
          const tiempoTotal = tiempo + pedido.tiempo;
          const finEstimado = ahora + tiempoTotal * 60_000;
          if (finEstimado > finTurno) continue;

          this.viajes.push({
            pedido,
            turno: this.turnoActual!,
            distanciaCliente: distancia,
            tiempoTotal: Math.round(tiempoTotal),
            inicio: new Date(ahora),
            fin: new Date(finEstimado),
            precio: 0 // se asigna tras aceptarPedido
          });
        }

        // Ordenar de menor a mayor distancia
        this.viajes.sort((a, b) => a.distanciaCliente - b.distanciaCliente);
      },
      error: err => {
        console.error('Error al obtener pedidos disponibles:', err);
        this.noDisponible = true;
      }
    });
  }


  /** Haversine */
  private toRad(x: number): number {
    return x * Math.PI / 180;
  }

  private calcularTiempoCliente(p: Pedido): { distancia: number; tiempo: number } {
    const R = 6371; // km
    const dLat = this.toRad(this.lat - p.origen.latitud);
    const dLon = this.toRad(this.lng - p.origen.longitud);
    const a = Math.sin(dLat/2)**2
            + Math.cos(this.toRad(p.origen.latitud))
            * Math.cos(this.toRad(this.lat))
            * Math.sin(dLon/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const dist = R * c;
    return { distancia: Number(dist.toFixed(2)), tiempo: Math.round(dist * 4) };
  }
}
