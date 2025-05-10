import { Component, OnInit} from '@angular/core';
import { Conductor } from '../services/conductor.service';
import { Cliente, ClienteService } from '../services/cliente.service';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../services/pedido.service';
import { ActivatedRoute } from '@angular/router';
import  cp  from '../data/codigos_postais.json';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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
}

declare const L : any;

@Component({
  selector: 'app-pedido',
  standalone: false,
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent implements OnInit {
  
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
  }

  cliente!: Cliente;
  map!: any;
  idPedido: string = '';
  formEnviado: boolean = false;
  constructor(private clienteService: ClienteService, private pedidoService: PedidoService, private route: ActivatedRoute, private router: Router) { }
  
  ngOnInit() {
    this.pedido.cliente = this.route.snapshot.paramMap.get('nif') || '';
    this.clienteService.obtenerClienteNIF(this.route.snapshot.paramMap.get('nif') || '')
      .subscribe(cliente => {
        this.cliente = cliente;
        this.pedido.cliente = cliente._id || '';
      });
    this.geolocalizar();

  }
  onSubmit(fp : NgForm) {
    if(fp.invalid) {
      this.formEnviado = true;
      return;
    }
    else{
      this.formEnviado = false;
      this.pedidoService.registrarPedido(this.pedido)
        .subscribe(pedido => {
          this.router.navigate(['/esperar-pedido',pedido._id]);
        },
        error => {
          console.log(error);
        }
      );
    }

  }
  private geolocalizar() {
    if(!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
      this.pedido.origen.latitud = position.coords.latitude;
      this.pedido.origen.longitud = position.coords.longitude;

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
    console.log(e.latlng);
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

  cambiarLocalidadOrigen(codP: string) {
    const localidad = (cp as any)[codP] || '';
    this.pedido.origen.localidad = localidad; 
  }
  
  cambiarLocalidadDestino(codP: string) {
    const localidad = (cp as any)[codP] || '';
    this.pedido.destino.localidad = localidad; 
  }

}
