import { Component, Input } from '@angular/core';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../services/cliente.service';
import { Router } from '@angular/router';
import cp from '../data/codigos_postais.json';


 
@Component({
  selector: 'app-cliente',
  standalone: false,
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})

export class clienteComponent {
  // Límites para el año de nacimiento
  minYear: number = new Date().getFullYear() - 100;
  maxYear: number = new Date().getFullYear() - 18;

  // Objeto completamente inicializado según la interfaz
  cliente: Cliente = {
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
  generos: Cliente['genero'][] = ['femenino', 'masculino'];

  clienteCreado: boolean = false;
  formEnviado: boolean = false;
  nifDuplicado: boolean = false;
  cpNoValido: boolean = false;

  mensaje: string = '';
  mensajelogin: string = '';
  niflogin: string = '';


  constructor(private clienteService: ClienteService
    , private router: Router
  ) {}

  ngOnInit() {  }

  cambiarLocalidad(codP: string) {
    const localidad = (cp as any)[codP] || '';
    this.cliente.direccion.localidad = localidad; 
  }

  onSubmit() {
    this.formEnviado = true;
    this.nifDuplicado = false;

    this.clienteService.crearCliente(this.cliente).subscribe({
      next: (cliente) => {
        this.clienteCreado = true;
        this.router.navigate(['/menu', cliente._id]);
      },
      error: (err) => {
        if (err.error.error == 'NIF ya existente') {
          this.nifDuplicado = true;
        }
      }
    });
  }

  validarNif(nif: string) {
    const regex = /^\d{9}$/;
    return regex.test(nif);
  }

  iniciarSesion() {
    if(!this.validarNif(this.niflogin)) {
      return;
    }
    this.clienteService.obtenerClienteNIF(this.niflogin).subscribe({
      next: (cliente) => {
        this.router.navigate(['/menu', cliente._id]);
      },
      error: (error) => {
        this.mensajelogin = `Error al iniciar sesion, no existe el NIF`
      }
    });
  }

}
