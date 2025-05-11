import { Injectable } from '@angular/core';
import { Pedido } from './pedido.service';
import { Turno } from './turno.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
export interface Viaje {
  _id?: string;
  pedido: Pedido;
  turno: Turno;
  distanciaCliente: number;
  tiempoTotal: number;
  inicio: Date;
  fin: Date;
  precio: number;
}
@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private url = 'http://localhost:3000/viaje'
  constructor( private http: HttpClient) { }

  registrarViaje(viaje: any): Observable<any> {
    return this.http.post(this.url, viaje);
  }

  getViajeIdPedido(id: string): Observable<any> {
    return this.http.get(`${this.url}/pedido/${id}`);
  }

  getViajeID(id: string): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }
  // Story 8
  finalizarViaje(id: string, data: { fin?: string; kilometros: number; precio?: number }): Observable<any> {
    return this.http.put(`${this.url}/finalizar/${id}`, data);
  }
  
}
