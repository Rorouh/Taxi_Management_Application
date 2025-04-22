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

  constructor(private taxiService: TaxiService) { }


  ngOnInit() {
    this.cargarTaxis();
  }
  onSubmit() {
    this.taxiService.registrarTaxi(this.taxi).subscribe({
      next: (response) => {
        this.cargarTaxis();
      },
      error: (error) => {
        alert(error.message);
      }

    });
  }

  cargarTaxis(): void {
    this.taxiService.getTaxis().subscribe({
      next: (data) => this.taxis = data,
      error: (error) => alert('Error al cargar taxis: ' + error.message)
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
