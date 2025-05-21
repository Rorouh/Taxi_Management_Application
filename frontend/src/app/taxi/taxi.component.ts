import { Component } from '@angular/core';
import { TaxiService, Taxi } from '../services/taxi.service';
import { TurnoService, Turno }  from '../services/turno.service';
import { ViajeService, Viaje } from '../services/viaje.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-taxi',
  standalone: false,
  templateUrl: './taxi.component.html',
  styleUrl: './taxi.component.css'
})
export class TaxiComponent{
  taxi: Partial<Taxi> = {
    matricula:    '',
    anoCompra:    undefined,
    marca:        '',
    modelo:       '',
    nivelConfort: undefined
  };

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
  editMode = false;
  editingId = '';
  showActive = false;
  activeTurnos: Turno[] = [];
  desactivarConfort = false;
  deleteMensaje: string = '';
  constructor(private taxiService: TaxiService, private turnoService: TurnoService, private ViajeService: ViajeService) { }



  ngOnInit() {
    this.cargarTaxis();
  }

  onSubmit(f : NgForm) {
    if(f.invalid){
      this.formEnviado = true;
      return;
    }
    this.mensaje = '';

    if(this.editMode == false){
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
          this.formEnviado = true;
        }
      });
    }
    else{
      this.taxiService.updateTaxi(this.editingId, this.taxi).subscribe({
        next: () => {
          this.taxicreado = true;
          this.cargarTaxis();
          this.reset();
        },
        error: (err) => {
          this.mensaje = err.error?.error || err.message;
          this.taxicreado = false;
          this.formEnviado = true;
        }
      });
    }

  }

  cargarTaxis(): void {
    this.taxiService.getTaxis().subscribe({
      next: (data) => this.taxis = data,
      error: (error) => console.error(error)
    });
  }

  editar(t: Taxi) {
    this.editMode = true;
    this.editingId = t._id || '';
    this.taxi = {
      matricula: t.matricula,
      anoCompra: t.anoCompra,
      marca: t.marca,
      modelo: t.modelo,
      nivelConfort: t.nivelConfort
    };
    this.cambiarMarca();
    this.ViajeService.taxiEnViajes(t._id || '').subscribe({
      next: ({enViaje}) => this.desactivarConfort = enViaje,
      error: err=> console.error(err)
    })
    this.formEnviado = this.taxicreado = false;
    this.mensaje = '';
    this.deleteMensaje = '';
  }


  borrar(t: Taxi) {
    if (!t._id) return;
    this.taxiService.deleteTaxi(t._id).subscribe({
      next: ()  => {
        this.cargarTaxis();
        this.deleteMensaje = ''
      },
      error: (error)=> {
        this.deleteMensaje = error.error.error;
      }
    });
  }
  
  reset() {
    this.editMode = false;
    this.editingId = '';
    this.formEnviado = false;
    this.desactivarConfort = false;
    this.taxi = {
      matricula: '',
      anoCompra: undefined,
      marca: '',
      modelo: '',
      nivelConfort: undefined
    }
  }

  cambiarMarca() {
    this.modelosDisponibles = this.modelosPorMarca[this.taxi.marca!] || [];
    if (!this.modelosDisponibles.includes(this.taxi.modelo!)) {
      this.taxi.modelo = '';
    }
  }

  toggleActive() {
    this.showActive = !this.showActive;
    if (this.showActive) {
      this.turnoService.getActiveTurnos().subscribe({
        next: datos => this.activeTurnos = datos,
        error: err => console.log('Error cargando turnos activos')
      });
    }
  }
}
