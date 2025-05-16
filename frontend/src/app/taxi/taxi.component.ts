import { Component, OnInit } from '@angular/core';
import { TaxiService, Taxi } from '../services/taxi.service';
import { TurnoService, Turno }  from '../services/turno.service';

@Component({
  selector: 'app-taxi',
  standalone: false,
  templateUrl: './taxi.component.html',
  styleUrls: ['./taxi.component.css']
})
export class TaxiComponent implements OnInit {
  // Ahora taxi es Partial<Taxi>, todas las props opcionales
  taxi: Partial<Taxi> = {
    matricula:    '',
    anoCompra:    undefined,
    marca:        '',
    modelo:       '',
    nivelConfort: undefined
  };

  taxis: Taxi[] = [];

  lista_marcas = [
    'Renault','Mercedes','Toyota','Fiat','Peugeot',
    'Nissan','Chevrolet','Honda','Mazda','Suzuki','Kia'
  ];

  modelosPorMarca: { [k: string]: string[] } = {
    Renault: ['Clio','Twingo','Megane'],
    Mercedes: ['Clase A','Clase B','Clase C'],
    Toyota: ['Corolla','Yaris','Camry'],
    Fiat: ['500','Punto','Doblo'],
    Peugeot: ['208','2008','3008'],
    Nissan: ['Qashqai','Leaf','Micra'],
    Chevrolet: ['Beat','Aveo','Cruze'],
    Honda: ['Civic','Accord','CR-V'],
    Mazda: ['3','6','CX-5'],
    Suzuki: ['Swift','Alto','Jimny'],
    Kia: ['Picanto','Rio','Sportage']
  };

  modelosDisponibles: string[] = [];
  taxicreado   = false;
  maxAnoCompra = new Date().getFullYear();
  formEnviado  = false;
  mensaje      = '';

  // Story 10
  editMode   = false;
  editingId  = '';

  showActive = false;
  activeTurnos: Turno[] = [];

  constructor(private taxiService: TaxiService, private turnoService: TurnoService) {}

  ngOnInit() {
    this.cargarTaxis();
  }

  onSubmit() {
    this.formEnviado = true;
    this.mensaje     = '';

    // Si estamos editando, usamos update; si no, registrar
    const call$ = this.editMode
      ? this.taxiService.updateTaxi(this.editingId, this.taxi)
      : this.taxiService.registrarTaxi(this.taxi as Taxi);

    call$.subscribe({
      next: () => {
        this.taxicreado = true;
        this.cargarTaxis();
        this.reset();
      },
      error: err => {
        this.mensaje     = err.error?.error || err.message;
        this.taxicreado  = false;
      }
    });
  }

  cargarTaxis() {
    this.taxiService.getTaxis().subscribe({
      next: data => this.taxis = data,
      error: ()   => alert('Error al cargar taxis')
    });
  }

  editar(t: Taxi) {
    this.editMode    = true;
    this.editingId   = t._id || '';
    this.taxi = {
      matricula:    t.matricula,
      anoCompra:    t.anoCompra,
      marca:        t.marca,
      modelo:       t.modelo,
      nivelConfort: t.nivelConfort
    };
    this.cambiarMarca();
    this.formEnviado = this.taxicreado = false;
    this.mensaje     = '';
  }

  borrar(t: Taxi) {
    if (!t._id) return;
    this.taxiService.deleteTaxi(t._id).subscribe({
      next: ()  => this.cargarTaxis(),
      error: err=> alert(err.error?.error || 'No se pudo eliminar')
    });
  }

  reset() {
    this.editMode    = false;
    this.editingId   = '';
    this.formEnviado = false;
    this.taxi = {
      matricula:    '',
      anoCompra:    undefined,
      marca:        '',
      modelo:       '',
      nivelConfort: undefined
    };
    this.modelosDisponibles = [];
    this.mensaje           = '';
  }

  cambiarMarca() {
    this.modelosDisponibles = this.modelosPorMarca[this.taxi.marca!] || [];
    if (!this.modelosDisponibles.includes(this.taxi.modelo!)) {
      this.taxi.modelo = '';
    }
  }
  //Extra stry 10 para ver los taxis activos y sus conductores respectivamente
  toggleActive() {
    this.showActive = !this.showActive;
    if (this.showActive) {
      this.turnoService.getActiveTurnos().subscribe({
        next: datos => this.activeTurnos = datos,
        error: err => alert('Error cargando turnos activos')
      });
    }
  }

}