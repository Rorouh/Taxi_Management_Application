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

@NgModule({
  declarations: [
    AppComponent,
    TaxiComponent,
    DashboardComponent,
    ConductorComponent,
    PrecioConfigComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,           // para formularios template-driven
    ReactiveFormsModule,   // para formularios reactivos (Conductor, Precio)
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
