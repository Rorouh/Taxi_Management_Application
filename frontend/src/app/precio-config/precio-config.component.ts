import { Component, OnInit } from '@angular/core';
import { PrecioService, Precio, Simulacion } from '../services/precio.service';

@Component({
  selector: 'app-precio-config',
  standalone: false,
  templateUrl: './precio-config.component.html',
  styleUrls: ['./precio-config.component.css']
})
export class PrecioConfigComponent implements OnInit {
  // 1) Objeto tipado para crear/actualizar precio, con valores iniciales válidos
  precio: Precio = {
    nivelConfort: 'basico',      // uno de los literales permitidos
    precioMinuto: 0,             // no puede ser null
    incrementoNocturno: 0        // no puede ser null
  };

  // 2) Objeto tipado para simular coste, con nivel inicial válido
  simulacion: Simulacion = {
    nivelConfort: 'basico',
    inicio: '',
    fin: ''
  };

  // 3) Tipado de los niveles de confort según la interfaz Precio
  niveles: Precio['nivelConfort'][] = ['basico', 'lujoso'];

  preciosExistentes: Precio[] = [];
  resultado: number | null = null;

  constructor(private precioService: PrecioService) {}

  ngOnInit(): void {
    this.cargarPrecios();
  }

  cargarPrecios(): void {
    this.precioService.obtenerPrecios().subscribe({
      next: list => this.preciosExistentes = list,
      error: err => console.log('Error cargando precios: ' + err.message)
    });
  }

  guardarPrecio(): void {
    this.precioService.registrarPrecio(this.precio).subscribe({
      next: () => {
        this.cargarPrecios();
      },
      error: err => console.log('Error guardando precio: ' + err.message)
    });
  }

  simularCoste(): void {
    this.precioService.simularCoste(this.simulacion).subscribe({
      next: r => this.resultado = r.coste,
      error: err => console.log('Error simulando coste: ' + err.message)
    });
  }
}
