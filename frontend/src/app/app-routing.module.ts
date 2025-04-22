import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { TaxiComponent }        from './taxi/taxi.component';
import { ConductorComponent }   from './conductor/conductor.component';
import { PrecioConfigComponent } from './precio-config/precio-config.component';  // << importa aquí

const routes: Routes = [
  { path: '',           redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'taxi',       component: TaxiComponent },
  { path: 'conductor',  component: ConductorComponent },
  { path: 'precio',     component: PrecioConfigComponent },  // << nue
  { path: '**',         redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
