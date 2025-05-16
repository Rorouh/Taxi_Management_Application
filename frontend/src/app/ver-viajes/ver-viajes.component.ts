import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ReportService,
  Totales,
  Subtotales,
  DetalleBase,
  DetalleHoras,
  DetalleKm
} from '../services/report.service';

@Component({
  selector: 'app-ver-viajes',
  standalone : false,
  templateUrl: './ver-viajes.component.html',
  styleUrls: ['./ver-viajes.component.css']
})
export class VerViajesComponent implements OnInit {
  inicio = new Date().toISOString().slice(0,10);
  fin    = new Date().toISOString().slice(0,10);

  etapa: 'totales'|'subtotales'|'detalles' = 'totales';
  tipoSeleccionado: 'viajes'|'horas'|'km'  = 'viajes';
  entidadSeleccionada: 'conductor'|'taxi'   = 'conductor';

  // inicializa con ceros y arrays vacíos
  totales: Totales = { totalViajes: 0, totalHoras: 0, totalKm: 0 };
  subtotales: Subtotales = { conductores: [], taxis: [] };
  detalles: Array<DetalleBase|DetalleHoras|DetalleKm> = [];

  constructor(
    private reportSrv: ReportService,
    private route: ActivatedRoute
  ) {}

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
