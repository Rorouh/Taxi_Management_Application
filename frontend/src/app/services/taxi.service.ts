import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Taxi {
  matricula: string;
  anoCompra: number;
  marca: string;
  modelo: string;
  nivelConfort: string;
  
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
}
