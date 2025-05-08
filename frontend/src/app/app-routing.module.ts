import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { TaxiComponent }        from './taxi/taxi.component';
import { ConductorComponent }   from './conductor/conductor.component';
import { PrecioConfigComponent } from './precio-config/precio-config.component'; 
import { IniciarSesionComponent } from './iniciar-sesion/iniciar-sesion.component';
import { MenuComponent } from './menu/menu.component';
import { TurnoComponent } from './turno/turno.component';
import { clienteComponent } from './cliente/cliente.component';
import { PedidoComponent } from './pedido/pedido.component';
const routes: Routes = [
  { path: '',           redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'taxi',       component: TaxiComponent },
  { path: 'conductor',  component: ConductorComponent },
  { path: 'precio',     component: PrecioConfigComponent },
  { path: 'iniciarSesion', component: IniciarSesionComponent },
  {path: 'menu/:nif', component: MenuComponent},
  {path: 'turno/:nif', component: TurnoComponent},
  {path: 'cliente', component: clienteComponent},
  {path: 'pedido/:id', component: PedidoComponent},
  { path: '**',         redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
