import { Component } from '@angular/core';
import { ConductorService } from '../services/conductor.service';
import { Router } from '@angular/router';

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
  selector: 'app-iniciar-sesion',
  standalone: false,
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.css'
})



export class IniciarSesionComponent {
  conductores: Conductor[] = [];

  constructor(
    private conductorService: ConductorService,
    private router: Router
  ) {}

  mensaje: string = '';
  nif: string = '';

  ngOnInit() {
    this.cargarConductores();
  }
  
  cargarConductores() {
    this.conductorService.obtenerConductores().subscribe({
      next: (data) => this.conductores = data,
      error: (error) => alert('Error al cargar conductores')
    });
  }


  iniciarSesion() {
    if(!this.validarNif(this.nif)) {
      return;
    }
    this.conductorService.obtenerConductorNIF(this.nif).subscribe({
      next: (data) => {
          this.mensaje = `Bienvenido`
          this.router.navigate(['/menu', this.nif]);
      },
      error: (error) => {
        this.mensaje = `Error al iniciar sesion, no existe el NIF`
      }

    });
  }
  iniciarSesionLista(nif: string) {
    this.nif = nif;
    this.iniciarSesion();
  }
  buscarConductor() {
    
    this.mensaje = `Error al iniciar sesion, no existe el NIF ${this.nif}`
  }

  validarNif(nif: string) {
    const regex = /^\d{9}$/;
    return regex.test(nif);
  }

}
