import { Component } from '@angular/core';
import { TaxiService, Taxi } from '../services/taxi.service';

@Component({
  selector: 'app-taxi',
  standalone: false,
  templateUrl: './taxi.component.html',
  styleUrl: './taxi.component.css'
})
export class TaxiComponent{
  taxi = {
    matricula: '',
    anoCompra: null,
    marca: '',
    modelo: '',
    nivelConfort: ''
  }

  taxis: Taxi[] = [];

  lista_marcas: string[] = ['Renault', 'Mercedes', 'Toyota', 'Fiat', 'Peugeot', 'Nissan', 'Chevrolet', 'Honda', 'Mazda', 'Suzuki', 'Kia'];

  modelosPorMarca: { [key: string]: string[] } = {
    Renault: ['Clio', 'Twingo', 'Megane'],
    Mercedes: ['Clase A', 'Clase B', 'Clase C'],
    Toyota: ['Corolla', 'Yaris', 'Camry'],
    Fiat: ['500', 'Punto', 'Doblo'],
    Peugeot: ['208', '2008', '3008'],
    Nissan: ['Qashqai', 'Leaf', 'Micra'],
    Chevrolet: ['Beat', 'Aveo', 'Cruze'],
    Honda: ['Civic', 'Accord', 'CR-V'],
    Mazda: ['3', '6', 'CX-5'],
    Suzuki: ['Swift', 'Alto', 'Jimny'],
    Kia: ['Picanto', 'Rio', 'Sportage']
  };

  modelosDisponibles: string[] = [];
  taxicreado: boolean = false;
  maxAnoCompra: number = new Date().getFullYear();
  formEnviado: boolean = false;
  mensaje: string = '';
  constructor(private taxiService: TaxiService) { }

  ngOnInit() {
    this.cargarTaxis();
  }

  onSubmit() {
    this.formEnviado = true;
    this.mensaje = '';

    this.taxiService.registrarTaxi(this.taxi).subscribe({
      next: (response) => {
        this.taxicreado = true;
        this.cargarTaxis();
        this.reset();
      },
      error: (error) => {
        if(error.error.error == 'Matricula ya existente') {
          this.mensaje = error.error.error;
        }
        this.taxicreado = false;
      }
    });
  }

  cargarTaxis(): void {
    this.taxiService.getTaxis().subscribe({
      next: (data) => this.taxis = data,
      error: (error) => alert('Error al cargar taxis')
    });
  }

  reset() {
    this.taxi = {
      matricula: '',
      anoCompra: null,
      marca: '',
      modelo: '',
      nivelConfort: ''
    }
    this.formEnviado = false;
  }

  cambiarMarca() {
    this.modelosDisponibles = this.modelosPorMarca[this.taxi.marca];
    this.taxi.modelo = '';
  }

}
