import { Component } from '@angular/core';
import { ConductorService } from '../services/conductor.service';
import cp from '../data/codigos_postais.json';
import { TurnoService, Turno }  from '../services/turno.service';
import { NgForm } from '@angular/forms';
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
  editMode = false;
  editingNif = '';
  showActive = false;
  activeTurnos: Turno[] = [];
  deleteMensaje: string = '';

  constructor(private turnoService: TurnoService,   private conductorService: ConductorService) {}

  ngOnInit() {
    this.cargarConductores();
  }

  cambiarLocalidad(codP: string) {
    const localidad = (cp as any)[codP] || '';
    this.conductor.direccion.localidad = localidad; 
  }
  onSubmit(f : NgForm) {
    if(f.invalid){
      this.formEnviado = true;
      return;
    }
    this.nifDuplicado = false;
    this.licenciaDuplicada = false;
    if(this.editMode == false){
      this.conductorService.crearConductor(this.conductor).subscribe({
      next: () => {
        this.cargarConductores();
        this.reset();
        this.conductorCreado = true;
      },
      error: (err) => {
        if (err.error.error == 'NIF ya existente') {
          this.nifDuplicado = true;
        }
        if (err.error.error == 'Licencia ya existente') {
          this.licenciaDuplicada = true;
        }
      }
    });
    }
    else{
      this.conductorService.updateConductor(this.editingNif, this.conductor).subscribe({
        next: () => {
          this.cargarConductores();
          this.reset();
          this.conductorCreado = true;
        },
        error: (err) => {
          if (err.error.error == 'NIF ya existente') {
            this.nifDuplicado = true;
          }
          if (err.error.error == 'Licencia ya existente') {
            this.licenciaDuplicada = true;
          }
        }
      });
    }

  }

  cargarConductores() {
    this.conductorService.obtenerConductores().subscribe({
      next: (data) => this.conductores = data,
      error: (error) => alert('Error al cargar conductores')
    });
  }

  editar(c: Conductor) {
    this.editMode = true;
    this.editingNif = c.nif;
    this.conductor = {
      nif: c.nif,
      nombre: c.nombre,
      genero: c.genero,
      anoNacimiento: c.anoNacimiento,
      direccion: {
        calle: c.direccion.calle,
        numero: c.direccion.numero,
        codigoPostal: c.direccion.codigoPostal,
        localidad: c.direccion.localidad
      },
      licencia: c.licencia
    };
    this.formEnviado = false;
    this.conductorCreado = false;
    this.nifDuplicado = false;
    this.licenciaDuplicada = false;
    this.deleteMensaje = '';
  }

  borrar(c: Conductor) {
    if (!c.nif) return;
    this.conductorService.deleteConductor(c.nif).subscribe({
      next: ()  => {
        this.cargarConductores();
        this.deleteMensaje = '';
      },
      error: (error)=> {
        this.deleteMensaje = error.error.error;
      }
    });
  }

  reset() {
    this.editMode = false;
    this.editingNif = '';
    this.deleteMensaje = '';
    this.conductorCreado = false;
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
