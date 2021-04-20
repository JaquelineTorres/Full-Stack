import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Medico } from '../_model/medico';
import { GenericService } from './generic.service';
// ************************ ES HIJO ************************
@Injectable({
  providedIn: 'root'
})
export class MedicoService extends GenericService<Medico>{
 //variable reactiva
 private medicoCambio = new Subject<Medico[]>();
 private mensajeCambio = new Subject<string>();
// ANTES DE LA HERENCIA -> private url : string = `${environment.HOST}/medicos`

 constructor(protected http: HttpClient){
   super(
     http,
     `${environment.HOST}/medicos`);
 }

/* ESTO ERA ANTES DE UTILIZAR HERENCIA DE generis.service

 listar(){
   return this.http.get<Medico[]>(this.url);
 }

 listarPorId(id: number){
   return this.http.get<Medico>(`${this.url}/${id}`);
 }

 registrar(medico: Medico){
   return this.http.post(this.url, medico);
 }
 modificar(medico: Medico){
   return this.http.put(this.url, medico);
 }
 eliminar(id: number){
   return this.http.delete(`${this.url}/${id}`);
 }
 */
  /* get, set */
  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMedicoCambio(lista: Medico[]) {
    this.medicoCambio.next(lista);
  }

  getMedicoCambio() {
    return this.medicoCambio.asObservable();
  }
}
