import { Component, Input, OnInit } from '@angular/core';
import { Pedido, PedidoService } from '../services/pedido.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Viaje, ViajeService } from '../services/viaje.service';
@Component({
  selector: 'app-esperar-pedido',
  standalone: false,
  templateUrl: './esperar-pedido.component.html',
  styleUrl: './esperar-pedido.component.css'
})
export class EsperarPedidoComponent  implements OnInit{
  pedido: Pedido = {} as Pedido;
  viaje: Viaje = {} as Viaje;
  conductorEncontrado: boolean = false;
  viajeEmpezado: boolean = false;
  private poller: any;

  constructor(private viajeService: ViajeService,private pedidoService: PedidoService, private route: ActivatedRoute, private router: Router){}
  

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    
    this.pedidoService.getPedidoId(id).subscribe({
      next: p => this.pedido = p,
      error: err => console.error(err)
    });

    this.poller = setInterval(() => {
      this.pedidoService.getPedidoId(id).subscribe({
        next: p => {
          this.pedido = p;
          if (p.estado === 'aceptado') {
            this.viajeService.getViajeIdPedido(id).subscribe({
              next: v => {
                this.viaje = v;
                this.conductorEncontrado = true;
              },
              error: err => console.error(err)
            })
            clearInterval(this.poller);  
          }
        },
        error: err => console.error('Error en polling:', err)
      });
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.poller);
    this.cancelarPedido();
  }

  

  cancelarPedido() {
    this.pedidoService.cambiarEstadoPedido(this.pedido._id || '', 'cancelado').subscribe({
      next: () => {
        this.pedido.estado = 'cancelado';
        this.router.navigate(['/pedido', this.pedido.cliente.nif]);
      },
      error: err => console.error(err)
    });
  }

  aceptarPedido() {
    this.pedidoService.cambiarEstadoPedido(this.pedido._id || '', 'en progreso').subscribe({
      next: () => {
        this.pedido.estado = 'en progreso';
        this.viajeEmpezado = true;
      },
      error: err => console.error(err)
    });
  }
}
