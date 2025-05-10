import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Conductor {
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

@Injectable({ providedIn: 'root' })
export class ConductorService {
  private url = 'http://localhost:3000/conductor';

  constructor(private http: HttpClient) {}

  crearConductor(data: Conductor): Observable<Conductor> {
    return this.http.post<Conductor>(this.url, data);
  }

  obtenerConductores(): Observable<Conductor[]> {
    return this.http.get<Conductor[]>(this.url);
  }

  obtenerConductorNIF(nif: string): Observable<Conductor> {
    return this.http.get<Conductor>(`${this.url}/${nif}`);
  }
  
}
