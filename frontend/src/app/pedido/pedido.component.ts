import { Component, Input } from '@angular/core';
import { Conductor } from '../services/conductor.service';
import { Cliente } from '../services/cliente.service';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../services/pedido.service';

interface PedidoFront {
  id?: string;
  cliente: string,
  origen:{
    calle: string;
    numero: string;
    codigoPostal: string;
    localidad: string;
    latitud: number;
    longitud: number;
  }, 
  destino:{
    calle: string;
    numero: string;
    codigoPostal: string;
    localidad: string;
    latitud: number;
    longitud: number;
  },
  numPersonas: number,
  estado: string,
  conductor: string,
  distancia: number,
  confort: string,
  tiempo: number,
  costo: number
}

@Component({
  selector: 'app-pedido',
  standalone: false,
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent {
  
  pedido: PedidoFront = {
    cliente: '',
    origen: {
      calle: '',
      numero: '',
      codigoPostal: '',
      localidad: '',
      latitud: 0,
      longitud: 0
    },
    destino: {
      calle: '',
      numero: '',
      codigoPostal: '',
      localidad: '',
      latitud: 0,
      longitud: 0
    },
    numPersonas: 0,
    estado: 'pendiente',
    conductor: '',
    distancia: 0,
    confort: '',
    tiempo: 0,
    costo: 0
  }

  ngOnInit() {
    
    }
}
