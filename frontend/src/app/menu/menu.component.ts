import { Component } from '@angular/core';
import { ConductorService } from '../services/conductor.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  nif: string = '';

  constructor(private conductorService: ConductorService, private route: ActivatedRoute) {
    this.nif = this.route.snapshot.paramMap.get('nif') || '';
  }
}
