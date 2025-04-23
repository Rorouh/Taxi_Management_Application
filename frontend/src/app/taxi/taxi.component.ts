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

  lista_marcas = ['Renault', 'Mercedes', 'Toyota', 'Fiat', 'Peugeot', 'Nissan', 'Chevrolet', 'Honda', 'Mazda', 'Suzuki', 'Kia'];
  modelos_por_marca = [
    'Clio', 'Twingo', 'Megane',
    'Clase A', 'Clase B', 'Clase C',
    'Corolla', 'Yaris', 'Camry',
    '500', 'Punto', 'Doblo',
    '208', '2008', '3008',
    'Qashqai', 'Leaf', 'Micra',
    'Beat', 'Aveo', 'Cruze',
    'Civic', 'Accord', 'CR-V',
    '3', '6', 'CX-5',
    'Swift', 'Alto', 'Jimny',
    'Picanto', 'Rio', 'Sportage'
  ];


  constructor(private taxiService: TaxiService) { }


  ngOnInit() {
    this.cargarTaxis();
  }
  onSubmit() {
    this.taxiService.registrarTaxi(this.taxi).subscribe({
      next: (response) => {
        alert('Taxi creado!');
        this.cargarTaxis();
        this.reset();
      },
      error: (error) => {
        alert('Campos incorrectos');
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
  }

}
