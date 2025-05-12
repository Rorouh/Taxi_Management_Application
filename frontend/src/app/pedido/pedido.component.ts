import { AfterViewInit, Component, OnInit} from '@angular/core';
import { Conductor } from '../services/conductor.service';
import { Cliente, ClienteService } from '../services/cliente.service';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../services/pedido.service';
import { ActivatedRoute } from '@angular/router';
import  cp  from '../data/codigos_postais.json';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { Subject } from 'rxjs';

export interface PedidoFront {
  id?: string;
  cliente: string,
  origen:{
    calle: string;
    numero: string;
    codigoPostal: string;
    localidad: string;
    latitud: number;
    longitud: number;
  }, 
  destino:{
    calle: string;
    numero: string;
    codigoPostal: string;
    localidad: string;
    latitud: number;
    longitud: number;
  },
  numPersonas: number,
  estado: string,
  confort: string,
  distancia: number,
  tiempo: number
}

declare const L : any;

@Component({
  selector: 'app-pedido',
  standalone: false,
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent implements OnInit, AfterViewInit {
  
  pedido: PedidoFront = {
    cliente: '',
    origen: {
      calle: '',
      numero: '',
      codigoPostal: '',
      localidad: '',
      latitud: 0,
      longitud: 0
    },
    destino: {
      calle: '',
      numero: '',
      codigoPostal: '',
      localidad: '',
      latitud: 0,
      longitud: 0
    },
    numPersonas: 1,
    estado: 'pendiente',
    confort: '',
    distancia: 0,
    tiempo: 0
  }
  private origenChanges = new Subject<void>();
  private destinoChanges = new Subject<void>();
  cliente!: Cliente;
  map!: any;
  mapOrigen!: any;
  idPedido: string = '';
  formEnviado: boolean = false;
  origenNoValido: boolean = false;
  destinoNoValido: boolean = false;
  constructor(private clienteService: ClienteService, private pedidoService: PedidoService, private route: ActivatedRoute, private router: Router) {
    this.origenChanges.pipe(debounceTime(500)).subscribe(() => this.geocodeOrigen());
    this.destinoChanges.pipe(debounceTime(500)).subscribe(() => this.geocodeDestino());
  }
  
  ngOnInit() {
    this.pedido.cliente = this.route.snapshot.paramMap.get('nif') || '';
    this.clienteService.obtenerClienteNIF(this.route.snapshot.paramMap.get('nif') || '')
      .subscribe(cliente => {
        this.cliente = cliente;
        this.pedido.cliente = cliente._id || '';
      });
  }
  
  ngAfterViewInit() {
    this.geolocalizar();
  }

  onSubmit(fp : NgForm) {
    if(fp.invalid) {
      this.formEnviado = true;
      return;
    }
    else{
      this.formEnviado = false;
      this.establecerDistancia();
      this.pedidoService.registrarPedido(this.pedido)
        .subscribe(pedido => {
          this.router.navigate(['/esperar-pedido', pedido._id]);
        });
    }

  }
  onOrigenChange() {
    this.origenChanges.next();
  }

  onDestinoChange() {
    this.destinoChanges.next();
  }
  private geolocalizar() {
    if(!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
      this.pedido.origen.latitud = position.coords.latitude;
      this.pedido.origen.longitud = position.coords.longitude;

      this.mapOrigen = L.map('mapOrigen').setView([this.pedido.origen.latitud, this.pedido.origen.longitud], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.mapOrigen);

      this.mapOrigen.on('click', (e: any) => this.setOrigen(e));

      this.map = L.map('mapDestino').setView([this.pedido.origen.latitud, this.pedido.origen.longitud], 13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      this.map.on('click', (e: any) => this.setDestino(e));

      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.pedido.origen.latitud}&lon=${this.pedido.origen.longitud}&zoom=18&addressdetails=1`;
      fetch(url).then(response => response.json()).then(data => {
        this.pedido.origen.calle = data.address.road;
        this.pedido.origen.numero = data.address.house_number;
        this.pedido.origen.localidad = data.address.city;
        this.pedido.origen.codigoPostal = data.address.postcode;
      })
    },
      (error) => {
        console.error(error);
      }

    );


  }

  setDestino(e : any){
    const {lat , lng} = e.latlng;
    this.pedido.destino.latitud = lat;
    this.pedido.destino.longitud = lng;
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.pedido.destino.latitud}&lon=${this.pedido.destino.longitud}&zoom=18&addressdetails=1`;
    fetch(url).then(response => response.json()).then(data => {
      this.pedido.destino.calle = data.address.road;
      this.pedido.destino.numero = data.address.house_number;
      this.pedido.destino.localidad = data.address.city;
      this.pedido.destino.codigoPostal = data.address.postcode;
    })
  }

  setOrigen(e : any){
    const {lat , lng} = e.latlng;
    this.pedido.origen.latitud = lat;
    this.pedido.origen.longitud = lng;
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.pedido.origen.latitud}&lon=${this.pedido.origen.longitud}&zoom=18&addressdetails=1`;
    fetch(url).then(response => response.json()).then(data => {
      this.pedido.origen.calle = data.address.road;
      this.pedido.origen.numero = data.address.house_number;
      this.pedido.origen.localidad = data.address.city;
      this.pedido.origen.codigoPostal = data.address.postcode;
    })
  }

  cambiarLocalidadOrigen(codP: string) {
    const localidad = (cp as any)[codP] || '';
    this.pedido.origen.localidad = localidad; 
  }
  
  cambiarLocalidadDestino(codP: string) {
    const localidad = (cp as any)[codP] || '';
    this.pedido.destino.localidad = localidad; 
  }

  private toRad(x: number) {
    return x * Math.PI / 180;
  }

  establecerDistancia(){
    const R = 6371;
    const lat1 = this.pedido.origen.latitud;
    const lon1 = this.pedido.origen.longitud;
    const lat2 = this.pedido.destino.latitud;
    const lon2 = this.pedido.destino.longitud;

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
      Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = (R * c).toFixed(2);
    this.pedido.distancia = Number(d);
    this.pedido.tiempo = Math.round(this.pedido.distancia*4);
  }
  
  geocodeOrigen(): void {
    const {calle, numero, codigoPostal, localidad} = this.pedido.origen;
    if(!calle || !numero || !codigoPostal || !localidad){
      this.origenNoValido = true;
      return;
    }
    const query = `${calle} ${numero}, ${localidad}, ${codigoPostal}`;
    const url   = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}`;
    fetch(url).then(response => response.json()).then(data => {
      if(data.length > 0){
        this.pedido.origen.latitud = data[0].lat;
        this.pedido.origen.longitud = data[0].lon;
        this.origenNoValido = false;
        if(this.mapOrigen){
          this.mapOrigen.setView([this.pedido.origen.latitud, this.pedido.origen.longitud], 18);
        }
      }else{
        this.origenNoValido = true;
      }
    })
    .catch(error => {
      this.origenNoValido = true;
      console.error(error);
    })
  }

  geocodeDestino(){
    const {calle, numero, codigoPostal, localidad} = this.pedido.destino;
    if(!calle || !numero || !codigoPostal || !localidad){
      this.destinoNoValido = true;
      return;
    }
    const query = `${calle} ${numero}, ${localidad}, ${codigoPostal}`;
    const url   = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}`;
    fetch(url).then(response => response.json()).then(data => {
      if(data.length > 0){
        this.pedido.destino.latitud = data[0].lat;
        this.pedido.destino.longitud = data[0].lon;
        this.destinoNoValido = false;
        if(this.map){
          this.map.setView([this.pedido.destino.latitud, this.pedido.destino.longitud], 18);
        }
      }else{
        this.destinoNoValido = true;
      }
    })
    .catch(error => {
      this.destinoNoValido = true;
      console.error(error);
    })
  }

}
