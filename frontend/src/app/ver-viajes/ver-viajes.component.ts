import { Component } from '@angular/core';
import { Viaje, ViajeService } from '../services/viaje.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-ver-viajes',
  standalone: false,
  templateUrl: './ver-viajes.component.html',
  styleUrl: './ver-viajes.component.css'
})
export class VerViajesComponent {
  viajes: Viaje[] = [];

  constructor(public viajeService: ViajeService, private route: ActivatedRoute) {}

  ngOnInit() {
    const nif  = this.route.snapshot.paramMap.get('nif') || '';
    this.viajeService.getViajesConductor(nif).subscribe(viajes => {
      this.viajes = viajes
    })
  }
}
