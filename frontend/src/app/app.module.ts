import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppRoutingModule }   from './app-routing.module';
import { AppComponent }       from './app.component';
import { TaxiComponent }      from './taxi/taxi.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConductorComponent } from './conductor/conductor.component';
import { PrecioConfigComponent } from './precio-config/precio-config.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }                from '@angular/common/http';
import { IniciarSesionComponent } from './iniciar-sesion/iniciar-sesion.component';
import { MenuComponent } from './menu/menu.component';
import { TurnoComponent } from './turno/turno.component';
import { ClienteComponent } from './cliente/cliente.component';
import { PedidoComponent } from './pedido/pedido.component';
import { EsperarPedidoComponent } from './esperar-pedido/esperar-pedido.component';

@NgModule({
  declarations: [
    AppComponent,
    TaxiComponent,
    DashboardComponent,
    ConductorComponent,
    PrecioConfigComponent,
    IniciarSesionComponent,
    MenuComponent,
    TurnoComponent,
    ClienteComponent,
    PedidoComponent,
    EsperarPedidoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,           
    ReactiveFormsModule,   
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
