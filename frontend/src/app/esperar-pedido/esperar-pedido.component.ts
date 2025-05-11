import { Component, Input, OnInit } from '@angular/core';
import { Pedido, PedidoService } from '../services/pedido.service';
import {PedidoFront} from '../pedido/pedido.component';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-esperar-pedido',
  standalone: false,
  templateUrl: './esperar-pedido.component.html',
  styleUrl: './esperar-pedido.component.css'
})
export class EsperarPedidoComponent  implements OnInit{
  pedido: Pedido = {} as Pedido;
  

  constructor(private pedidoService: PedidoService, private route: ActivatedRoute, private router: Router){}
  

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pedidoService.getPedidoId(id).subscribe({
        next: p => this.pedido = p,
        error: err => console.error(err)
      });
    }
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

  

