import { Component } from '@angular/core';
import { Viaje, ViajeService } from '../services/viaje.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Pedido, PedidoService } from '../services/pedido.service';

@Component({
  selector: 'app-viaje',
  standalone: false,
  templateUrl: './viaje.component.html',
  styleUrl: './viaje.component.css'
})
export class ViajeComponent {
  viaje: Viaje = {} as Viaje;
  aceptado: boolean = false;
  cancelado: boolean = false;
  titulo = 'Esperando a que el cliente acepte...'
  private poller: any;

  constructor(private pedidoService: PedidoService,private viajeService: ViajeService, private route: ActivatedRoute, private router: Router){}
  

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.viajeService.getViajeID(id).subscribe({
      next: v => {
        this.viaje = v;

        this.poller = setInterval(() => {
          this.pedidoService.getPedidoId(this.viaje.pedido._id || '')
            .subscribe({
              next: p => {
                this.viaje.pedido = p;
                if (p.estado === 'en progreso') {
                  this.aceptado = true;
                  this.titulo = 'El viaje ha sido aceptado';
                  clearInterval(this.poller);
                }
                if (p.estado === 'cancelado') {
                  this.cancelado = true;
                  this.titulo = 'El viaje ha sido cancelado';
                  clearInterval(this.poller);
                }
              },
              error: err => console.error('Error al refrescar pedido:', err)
            });
        }, 5000);
      },
      error: err => console.error('Error al cargar viaje:', err)
    });
  }

  ngOnDestroy() {
    clearInterval(this.poller);
  }

  

}
