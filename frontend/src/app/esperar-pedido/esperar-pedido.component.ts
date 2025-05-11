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
  

  constructor(private viajeService: ViajeService,private pedidoService: PedidoService, private route: ActivatedRoute, private router: Router){}
  

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    
    this.pedidoService.getPedidoId(id).subscribe({
      next: p => this.pedido = p,
      error: err => console.error(err)
    });

    const poller = setInterval(() => {
      this.pedidoService.getPedidoId(id).subscribe({
        next: p => {
          this.pedido = p;
          if (p.estado !== 'pendiente') {
            this.viajeService.getViajeIdPedido(id).subscribe({
              next: v => {
                this.viaje = v;
              },
              error: err => console.error(err)
            })
            clearInterval(poller);  
          }
        },
        error: err => console.error('Error en polling:', err)
      });
    }, 5000);
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


}

  

