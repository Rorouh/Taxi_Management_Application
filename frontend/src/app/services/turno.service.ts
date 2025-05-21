import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Taxi } from './taxi.service';
import { Conductor } from './conductor.service';

export interface Turno {
  _id: string;
  inicio: Date;
  fin: Date;
  taxi: Taxi;
  conductor: Conductor;
}

@Injectable({
  providedIn: 'root'
})


export class TurnoService {
  private url = 'http://localhost:3000/turno'
  constructor(private http: HttpClient) { }

  getTurnos(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  createTurno(turno: any): Observable<any> {
    return this.http.post<any>(this.url, turno);
  }

  getTurnosConductor(nif: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/${nif}`);
  }

  getTaxisDisponibles(inicio: Date, fin: Date): Observable<Taxi[]> {
    return this.http.post<any[]>(`${this.url}/taxis-disponibles`, {
      inicio,
      fin
    });
  }
  
    getActiveTurnos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/activos`);
  }


}
