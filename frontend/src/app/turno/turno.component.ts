import { Component } from '@angular/core';
import { Turno } from '../services/turno.service';
import { TurnoService } from '../services/turno.service';
import { Taxi } from '../services/taxi.service';
import { TaxiService } from '../services/taxi.service';
import { Conductor } from '../services/conductor.service';
import { ConductorService } from '../services/conductor.service';
import { ActivatedRoute } from '@angular/router';

interface TurnoFront {
  inicio: Date;
  fin: Date;
  taxi: string;
  conductor: string;
}

@Component({
  selector: 'app-turno',
  standalone: false,
  templateUrl: './turno.component.html',
  styleUrl: './turno.component.css'
})



export class TurnoComponent {

  turno: TurnoFront = {
    inicio: new Date(),
    fin: new Date(),
    taxi: '',
    conductor: ''
  }

  taxis: Taxi[] = [];
  turnos: Turno[] = [];

  mensaje = '';
  turnoCreado = false;
  mostrarTaxis = false;

  constructor(
    private turnoService: TurnoService,
    private taxiService: TaxiService,
    private conductorService: ConductorService,
    private route: ActivatedRoute
  ){}

  ngOnInit() {
    this.cargarConductor();
    this.cargarTurnos();
  }

  reservarTurno(taxi: Taxi) {
    this.turnoCreado = false;
    this.turno.taxi = taxi._id || '';
    
    this.turnoService.createTurno(this.turno).subscribe({
      next: (turno) => {
        this.resetForm();
        this.turnoCreado = true;
        this.turnos.push(turno);
      },
      error: (error) => {
        this.mensaje = error.error.error;
      } 
    });
  }

  cargarConductor(){
    this.conductorService.obtenerConductorNIF(this.route.snapshot.paramMap.get('nif') || '').subscribe(conductor => this.turno.conductor = conductor._id || '');
  }
  cargarTurnos() {
    this.turnoService.getTurnosConductor(this.route.snapshot.paramMap.get('nif') || '').subscribe(turnos => this.turnos = turnos);
  }

  

  mostrarTaxisDisponibles() {
    this.mostrarTaxis = false;
    this.turnoCreado = false;
    
    for(const turno of this.turnos){
      if(
        (turno.fin > this.turno.inicio && turno.inicio > this.turno.inicio) || 
        (turno.inicio < this.turno.fin && this.turno.fin < turno.fin) ||
        (turno.inicio < this.turno.inicio && this.turno.fin > turno.fin)
      ){
        this.mensaje = 'El conductor esta ocupado en ese horario';
        return;
      }
    }

    this.turnoService.getTaxisDisponibles(this.turno.inicio, this.turno.fin).subscribe({
      next: (taxis) => {
        this.mostrarTaxis = true;
        this.taxis = taxis;
        this.mensaje = '';
      },
      error: (error) => {
        this.mensaje = error.error.error;
      }
    });
  }
  
  resetForm() {
    this.turno = {
      inicio: new Date(),
      fin: new Date(),
      taxi: '',
      conductor: this.turno.conductor
    };
    this.mensaje = '';
    this.mostrarTaxis = false;
    
  }
}
