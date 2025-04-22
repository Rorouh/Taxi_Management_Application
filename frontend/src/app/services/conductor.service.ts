import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Conductor {
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
  private api = '/api/conductores';

  constructor(private http: HttpClient) {}

  crearConductor(data: Conductor): Observable<Conductor> {
    return this.http.post<Conductor>(`${this.api}/registro`, data);
  }
}
