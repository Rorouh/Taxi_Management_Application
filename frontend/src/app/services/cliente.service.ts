import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Cliente {
  _id?: string;
  nif: string;
  nombre: string;
  genero: 'femenino'|'masculino';
  anoNacimiento: number;
  direccion: {
    calle: string;
    numero: string;
    codigoPostal: string;
    localidad: string;
  };
  licencia: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private api = 'http://localhost:3000/cliente'
  constructor(
    private http: HttpClient) { }

    crearCliente(cliente: Cliente): Observable<Cliente> {
      return this.http.post<Cliente>(this.api, cliente);
    }

    obtenerClienteNIF(nif: string): Observable<Cliente> {
      return this.http.get<Cliente>(`${this.api}/${nif}`);
    }
}
