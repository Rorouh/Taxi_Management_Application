import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from './dashboard/dashboard.component';
import { TaxiComponent }        from './taxi/taxi.component';
import { ConductorComponent }   from './conductor/conductor.component';
import { PrecioConfigComponent } from './precio-config/precio-config.component'; 
import { IniciarSesionComponent } from './iniciar-sesion/iniciar-sesion.component';
import { MenuComponent } from './menu/menu.component';
import { TurnoComponent } from './turno/turno.component';
import { ClienteComponent } from './cliente/cliente.component';
import { PedidoComponent } from './pedido/pedido.component';
import { EsperarPedidoComponent } from './esperar-pedido/esperar-pedido.component';
import { AceptarPedidosComponent } from './aceptar-pedidos/aceptar-pedidos.component';
import { ViajeComponent } from './viaje/viaje.component';
import { VerViajesComponent } from './ver-viajes/ver-viajes.component';

const routes: Routes = [
  { path: '',           redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'taxi',       component: TaxiComponent },
  { path: 'conductor',  component: ConductorComponent },
  { path: 'precio',     component: PrecioConfigComponent },
  { path: 'iniciar-sesion', component: IniciarSesionComponent },
  {path: 'menu/:nif', component: MenuComponent},
  {path: 'turno/:nif', component: TurnoComponent},
  {path: 'cliente', component: ClienteComponent},
  {path: 'pedido/:nif', component: PedidoComponent},
  {path: 'esperar-pedido/:id', component: EsperarPedidoComponent},
  {path: 'aceptar-pedidos/:nif', component: AceptarPedidosComponent},
  {path: 'viaje/:id', component: ViajeComponent},
  {path: 'ver-viajes/:nif', component: VerViajesComponent},
  { path: '**',         redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
