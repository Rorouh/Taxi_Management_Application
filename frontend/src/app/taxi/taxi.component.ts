import { Component } from '@angular/core';
import { TaxiService } from '../taxi.service';

@Component({
  selector: 'app-taxi',
  standalone: false,
  templateUrl: './taxi.component.html',
  styleUrl: './taxi.component.css'
})
export class TaxiComponent {
  taxi = {
    matricula: '',
    anoDeCompra: null,
    marca: '',
    modelo: '',
    nivelDeConforto: ''
  }

  constructor(private taxiService: TaxiService) { }

  onSubmit() {
    this.taxiService.createTaxi(this.taxi).subscribe({
      next: (response) => {
        alert('Taxi criado!');
      },
      error: (error) => {
        alert(error.message);
      }
    });
  }
}
