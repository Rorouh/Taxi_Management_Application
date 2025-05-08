import { Injectable } from '@angular/core';
import { Cliente } from './cliente.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Conductor } from './conductor.service';


export interface Pedido {
  id?: string;
  cliente: Cliente,
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
  conductor: Conductor,
  distancia: number,
  confort: string,
  tiempo: number,
  costo: number
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private url = 'http://localhost:3000/pedido'
  constructor( private http: HttpClient) { }

  registrarPedido(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.url, pedido);
  }
}
