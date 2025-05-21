import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conductor } from './conductor.service';
import { Taxi } from './taxi.service';

export interface Totales {
  totalViajes: number;
  totalHoras: number;
  totalKm: number;
}

export interface Subtotales {
  conductores: Array<{ conductor: any; valor: number }>;
  taxis: Array<{ taxi: any; valor: number }>;
}

export interface DetalleBase {
    viajeId: string;
    inicio: string; 
    fin: string; 
  
    horas?: number;
    km?: number;
}

export interface DetalleHoras extends DetalleBase {
    horas: number; 
}
export interface DetalleKm extends DetalleBase {
    km: number;  
}
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private api = 'http://localhost:3000/reportes';

  constructor(private http: HttpClient) {}

  obtenerTotales(inicio: string, fin: string): Observable<Totales> {
    return this.http.get<Totales>(`${this.api}/totales?inicio=${inicio}&fin=${fin}`);
  }

  obtenerSubtotales(tipo: 'viajes' | 'horas' | 'km', inicio: string, fin: string): Observable<Subtotales> {
    return this.http.get<Subtotales>(
      `${this.api}/subtotales/${tipo}?inicio=${inicio}&fin=${fin}`
    );
  }

  obtenerDetalles(tipo: 'viajes' | 'horas' | 'km', entidad: 'conductor' | 'taxi', id: string, inicio: string, fin: string): Observable<Array<DetalleBase | DetalleHoras | DetalleKm>> {
    return this.http.get<Array<DetalleBase | DetalleHoras | DetalleKm>>(
      `${this.api}/detalles/${tipo}/${entidad}/${id}?inicio=${inicio}&fin=${fin}`
    );
  }
}


