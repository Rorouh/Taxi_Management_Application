import { Component } from '@angular/core';
import { ConductorService } from '../services/conductor.service';
import cp from '../data/codigos_postais.json';
import { TurnoService, Turno }  from '../services/turno.service';

interface Conductor {
  nif: string;
  nombre: string;
  genero: 'femenino' | 'masculino';
  anoNacimiento: number;
  direccion: {
    calle: string;
    numero: string;
    codigoPostal: string;
    localidad: string;
  };
  licencia: string;
}

@Component({
  selector: 'app-conductor',
  standalone: false,
  templateUrl: './conductor.component.html',
  styleUrls: ['./conductor.component.css']
})
export class ConductorComponent {
  // Límites para el año de nacimiento
  minYear: number = new Date().getFullYear() - 100;
  maxYear: number = new Date().getFullYear() - 18;

  // Objeto completamente inicializado según la interfaz
  conductor: Conductor = {
    nif: '',
    nombre: '',
    genero: 'femenino',
    anoNacimiento: this.maxYear,
    direccion: {
      calle: '',
      numero: '',
      codigoPostal: '',
      localidad: ''
    },
    licencia: ''
  };

  conductores : Conductor[] = [];
  generos: Conductor['genero'][] = ['femenino', 'masculino'];

  conductorCreado: boolean = false;
  formEnviado: boolean = false;
  nifDuplicado: boolean = false;
  licenciaDuplicada: boolean = false;
  cpNoValido: boolean = false;

  editMode      = false;
  editingNif    = '';

  showActive = false;
  activeTurnos: Turno[] = [];

  constructor(private conductorService: ConductorService, private turnoService : TurnoService) {}

  ngOnInit() {
    this.cargarConductores();
  }

  onSubmit() {
    this.formEnviado = true;
    this.nifDuplicado = this.licenciaDuplicada = false;

    const call$ = this.editMode
      ? this.conductorService.updateConductor(this.editingNif, this.conductor)
      : this.conductorService.crearConductor(this.conductor);

    call$.subscribe({
      next: () => {
        this.resetForm();
        this.cargarConductores();
        this.conductorCreado = true;
        this.editMode = false;
      },
      error: err => {
        const e = err.error.error;
        if (e === 'NIF ya existente') this.nifDuplicado = true;
        if (e === 'Licencia ya existente') this.licenciaDuplicada = true;
      }
    });
  }
  cambiarLocalidad(codP: string) {
    const localidad = (cp as any)[codP] || '';
    this.conductor.direccion.localidad = localidad; 
  }

  cargarConductores() {
    this.conductorService.obtenerConductores().subscribe({
      next: (data) => this.conductores = data,
      error: (error) => alert('Error al cargar conductores')
    });
  }
  resetForm() {
    this.conductor = {
      nif: '',
      nombre: '',
      genero: 'femenino',
      anoNacimiento: this.maxYear,
      direccion: {
        calle: '',
        numero: '',
        codigoPostal: '',
        localidad: ''
      },
      licencia: ''
    };
    this.formEnviado = false;
    this.nifDuplicado = false;
    this.licenciaDuplicada = false;
  }

  //Story 11
  editar(c: Conductor) {
    this.editMode      = true;
    this.editingNif    = c.nif;
    this.conductor     = { ...c };
    this.formEnviado   = this.conductorCreado = false;
  }

  borrar(c: Conductor) {
    if (!confirm(`Eliminar conductor ${c.nombre}?`)) return;
    this.conductorService.deleteConductor(c.nif).subscribe({
      next: () => this.cargarConductores(),
      error: err => alert(err.error.error || 'No se pudo eliminar')
    });
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
