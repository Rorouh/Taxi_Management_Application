import { Component } from '@angular/core';
import { ConductorService } from '../services/conductor.service';

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

  constructor(private conductorService: ConductorService) {}

  ngOnInit() {
    this.cargarConductores();
  }
  onSubmit() {
    this.conductorService.crearConductor(this.conductor).subscribe({
      next: () => {
        alert('Conductor creado!');
        this.cargarConductores();
        this.resetForm();
      },
      error: (err) => {
        alert('Campos incorrectos');
      }
    });
  }

  cargarConductores() {
    this.conductorService.obtenerConductores().subscribe({
      next: (data) => this.conductores = data,
      error: (error) => alert('Error al cargar conductores')
    });
  }
  private resetForm() {
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
  }
}
