import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Taxi {
  _id?: string;
  matricula: string;
  anoCompra: number;
  marca: string;
  modelo: string;
  nivelConfort: 'basico' | 'lujoso';
}

@Injectable({
  providedIn: 'root'
})

export class TaxiService {
  private url = 'http://localhost:3000/taxi';
  constructor(private http: HttpClient) { }

  getTaxis(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  registrarTaxi(taxi: any): Observable<any> {
    return this.http.post<any>(this.url, taxi);
  }

  updateTaxi(id: string, taxi: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, taxi);
  }

  deleteTaxi(id: string): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
}
