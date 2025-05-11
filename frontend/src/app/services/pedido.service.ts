import { Injectable } from '@angular/core';
import { Cliente } from './cliente.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Conductor } from './conductor.service';


export interface Pedido {
  _id?: string;
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
  confort: string,
  distancia: number,
  tiempo: number
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private url = 'http://localhost:3000/pedido'

  constructor( private http: HttpClient) { }

  registrarPedido(pedido: any): Observable<any> {
    return this.http.post<any>(this.url, pedido);
  }

  getPedidoId(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  cambiarEstadoPedido(id: string, estado: string): Observable<any> {
    return this.http.post<any>(`${this.url}/cambiar-estado/${id}`, { estado });
  }

  getPedidosDisponibles(confort: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}/pendientes`, { confort });
  }
}
