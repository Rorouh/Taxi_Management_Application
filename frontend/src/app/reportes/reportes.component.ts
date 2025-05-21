import { Component } from '@angular/core';
import { ReportService } from '../services/report.service';
import {
  Totales,
  Subtotales,
  DetalleBase,
  DetalleHoras,
  DetalleKm
} from '../services/report.service';

@Component({
  selector: 'app-reportes',
  standalone: false,
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {

  inicio = new Date().toISOString().slice(0,10);
  fin    = new Date().toISOString().slice(0,10);

  etapa: 'totales'|'subtotales'|'detalles' = 'totales';
  tipoSeleccionado: 'viajes'|'horas'|'km' = 'viajes';
  entidadSeleccionada: 'conductor'|'taxi' = 'conductor';

  totales: Totales = { totalViajes: 0, totalHoras: 0, totalKm: 0 };
  subtotales: Subtotales = { conductores: [], taxis: [] };
  detalles: Array<DetalleBase|DetalleHoras|DetalleKm> = [];

  constructor(private reportSrv: ReportService) {}

  ngOnInit() {
    this.cargarTotales();
  }

  cargarTotales() {
    this.etapa = 'totales';
    this.reportSrv.obtenerTotales(this.inicio, this.fin)
      .subscribe(t => this.totales = t);
  }

  verSubtotales(tipo: 'viajes'|'horas'|'km') {
    this.tipoSeleccionado = tipo;
    this.etapa = 'subtotales';
    this.reportSrv.obtenerSubtotales(tipo, this.inicio, this.fin)
      .subscribe(s => this.subtotales = s);
  }

  verDetalles(entidad: 'conductor'|'taxi', id: string) {
    this.entidadSeleccionada = entidad;
    this.etapa = 'detalles';
    this.reportSrv.obtenerDetalles(
      this.tipoSeleccionado, entidad, id, this.inicio, this.fin
    ).subscribe(d => this.detalles = d);
  }
}
