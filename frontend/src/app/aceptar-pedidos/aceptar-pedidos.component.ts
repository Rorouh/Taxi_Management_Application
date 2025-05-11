import { Component, Input, OnInit } from '@angular/core';
import { Pedido, PedidoService } from '../services/pedido.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Turno, TurnoService } from '../services/turno.service';
import { Viaje, ViajeService } from '../services/viaje.service';
interface ViajeFront{
    pedido: string,
    turno: string,
    distanciaCliente: number,
    tiempototal: number,
    inicio: Date,
    fin: Date
}
@Component({
  selector: 'app-aceptar-pedidos',
  standalone: false,
  templateUrl: './aceptar-pedidos.component.html',
  styleUrl: './aceptar-pedidos.component.css'
})
export class AceptarPedidosComponent {
  viajeFront: ViajeFront = {
    pedido: '',
    turno: '',
    distanciaCliente: 0,
    tiempototal: 0,
    inicio: new Date(),
    fin: new Date()
  };
  lat: number = 38.756734;
  lng: number = -9.155412;
  TurnoActual: Turno = {} as Turno;
  noDisponible: boolean = false;
  viajes: Viaje[] = [];

  constructor(private viajeService: ViajeService,private turnoService: TurnoService, private pedidoService: PedidoService, private route: ActivatedRoute, private router: Router){}

  aceptarPedido(viaje: Viaje){
    this.viajeFront.pedido = viaje.pedido._id || '';
    this.viajeFront.turno = viaje.turno._id || '';
    this.viajeFront.distanciaCliente = viaje.distanciaCliente;
    this.viajeFront.tiempototal = viaje.tiempoTotal;
    this.viajeFront.inicio = new Date(Date.now());
    this.viajeFront.fin = viaje.fin;
    this.pedidoService.cambiarEstadoPedido(viaje.pedido._id || '', 'en progreso').subscribe(() => {

    });
    this.viajeService.registrarViaje(this.viajeFront).subscribe(() => {
      
      this.router.navigate(['viajes']);
    });
  }
  ngOnInit(){
    this.turnoService.getTurnosConductor(this.route.snapshot.paramMap.get('nif') || '')
      .subscribe(turnos => {
        for(let turno of turnos){
          const inicioTurno = new Date(turno.inicio).getTime();
          const finTurno = new Date(turno.fin).getTime();
          if(inicioTurno < Date.now() && finTurno > Date.now()){
            this.TurnoActual = turno;
            break;
          }
        };
        if(this.TurnoActual == null){
          this.noDisponible = true;
          return;
        }
        if(!navigator.geolocation) {
          this.obtenerListaViajes();
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;

            this.obtenerListaViajes();
          },
          (error) => {
            console.error(error);
          }
        );

      });
  }


  obtenerListaViajes(){
    this.pedidoService.getPedidosDisponibles(this.TurnoActual.taxi.nivelConfort )
      .subscribe(pedidos => {
        const now = Date.now();
        const finTurno = new Date(this.TurnoActual.fin).getTime();
        this.viajes = [];
        for(const pedido of pedidos){
          const {distancia, tiempo} = this.calcularTiempoCliente(pedido);
          const tiempoTotal = tiempo + pedido.tiempo;
          const fechaFin = now + (tiempoTotal * 60 * 1000);
          if(fechaFin > finTurno){
            continue;
          }
          const viaje = {} as Viaje;
          viaje.pedido = pedido;
          viaje.turno = this.TurnoActual;
          viaje.distanciaCliente = distancia;
          viaje.tiempoTotal = Math.round(tiempoTotal);
          viaje.inicio = new Date(now);
          viaje.fin = new Date(fechaFin);
          this.viajes.push(viaje);

        }
        this.viajes.sort((a, b) => a.distanciaCliente - b.distanciaCliente);
      });
  }

  private toRad(x: number) {
    return x * Math.PI / 180;
  }
  calcularTiempoCliente(pedido: Pedido){
    const R = 6371;
    const lat1 = pedido.origen.latitud;
    const lon1 = pedido.origen.longitud;
    const lat2 = this.lat;
    const lon2 = this.lng;

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = (R * c).toFixed(2);
    const distancia = Number(d);
    const tiempo = Math.round(distancia*4);

    return {distancia: distancia, tiempo: tiempo};
  }
  



}
