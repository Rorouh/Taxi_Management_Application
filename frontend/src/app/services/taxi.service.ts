import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { get } from 'node:http';

export interface Taxi {
  _id?: string;
  matricula: string;
  anoCompra: number;
  marca: string;
  modelo: string;
  nivelConfort: 'basico' | 'lujoso';
}

@Injectable({ providedIn: 'root' })

export class TaxiService {
  private url = 'http://localhost:3000/taxi';

  constructor(private http: HttpClient) { }

  getTaxis(): Observable<Taxi[]> {
    return this.http.get<Taxi[]>(this.url);
  }

  registrarTaxi(taxi: Taxi): Observable<Taxi> {
    return this.http.post<Taxi>(this.url, taxi);
  }

  //Story 10
  updateTaxi(id: string, taxi: Partial<Taxi>): Observable<Taxi> {
    return this.http.put<Taxi>(`${this.url}/${id}`, taxi);
  }

  deleteTaxi(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }
}

