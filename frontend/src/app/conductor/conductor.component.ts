import { Component } from '@angular/core';
import { ConductorService } from '../services/conductor.service';
import cp from '../data/codigos_postais.json';
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

  constructor(private conductorService: ConductorService) {}

  ngOnInit() {
    this.cargarConductores();
  }

  cambiarLocalidad(codP: string) {
    const localidad = (cp as any)[codP] || '';
    this.conductor.direccion.localidad = localidad; 
  }
  onSubmit() {
    this.formEnviado = true;
    this.nifDuplicado = false;
    this.licenciaDuplicada = false;

    this.conductorService.crearConductor(this.conductor).subscribe({
      next: () => {
        this.cargarConductores();
        this.resetForm();
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
    this.formEnviado = false;
    this.nifDuplicado = false;
    this.licenciaDuplicada = false;
  }


}
