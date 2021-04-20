import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Examen } from '../_model/examen';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// ************************ ES HIJO ************************
@Injectable({
  providedIn: 'root'
})
export class ExamenService extends GenericService<Examen> {
  //variable reactiva
  private examenCambio = new Subject<Examen[]>();
  private mensajeCambio = new Subject<string>();
  //ANTES DE LA HERENCIA -> private url : string = `${environment.HOST}/pacientes`

  constructor(protected http: HttpClient){
    super(
      http,
      `${environment.HOST}/examenes`);
  }
  /*get set*/
  setMensajeCambio(mensaje: string){
      this.mensajeCambio.next(mensaje);
    }
  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setExamenCambio(lista: Examen[]){
    this.examenCambio.next(lista);
  }
  getExamenCambio(){
    return this.examenCambio.asObservable();
  }
}
