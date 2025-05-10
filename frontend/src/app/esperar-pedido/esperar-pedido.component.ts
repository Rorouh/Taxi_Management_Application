import { Component, Input, OnInit } from '@angular/core';
import { Pedido, PedidoService } from '../services/pedido.service';
import {PedidoFront} from '../pedido/pedido.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-esperar-pedido',
  standalone: false,
  templateUrl: './esperar-pedido.component.html',
  styleUrl: './esperar-pedido.component.css'
})
export class EsperarPedidoComponent  implements OnInit{
  pedido!: Pedido;

  constructor(private pedidoService: PedidoService, private route: ActivatedRoute){}
  

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pedidoService.getPedidoId(id).subscribe({
        next: p => this.pedido = p,
        error: err => console.error(err)
      });
    }
  }
}

  

