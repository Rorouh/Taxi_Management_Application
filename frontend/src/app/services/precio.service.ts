import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Precio {
  nivelConfort: 'basico' | 'lujoso';
  precioMinuto: number;
  incrementoNocturno: number;   // 0.2 -> 20%
}

export interface Simulacion {
  nivelConfort: 'basico' | 'lujoso';
  inicio: string;  // la fecha en formato ISO
  fin:    string;  // la fecha en formato ISO
}

@Injectable({ providedIn: 'root' })
export class PrecioService {
  private api = 'http://localhost:3000/precios';

  constructor(private http: HttpClient) {}

  registrarPrecio(data: Precio): Observable<Precio> {
    return this.http.post<Precio>(`${this.api}`, data);
  }

  obtenerPrecios(): Observable<Precio[]> {
    return this.http.get<Precio[]>(`${this.api}`);
  }

  simularCoste(data: Simulacion): Observable<{ coste: number }> {
    return this.http.post<{ coste: number }>(`${this.api}/simular`, data);
  }
}
