import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Paciente } from '../_model/paciente';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';
// ************************ ES HIJO ************************
@Injectable({
  providedIn: 'root'
})
export class PacienteService extends GenericService<Paciente> {
  //variable reactiva
  private pacienteCambio = new Subject<Paciente[]>();
  private mensajeCambio = new Subject<string>();
  //ANTES DE LA HERENCIA -> private url : string = `${environment.HOST}/pacientes`

  constructor(protected http: HttpClient){
    super(
      http,
      `${environment.HOST}/pacientes`);
  }

  //PARA paginator RECORDAR QUE ESTO SE AGREGA EN SPRING

  listarPageable(p: number, s: number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  /* STO ERA ANTES DE UTILIZAR HERENCIA DE generis.service
  listar(){
    return this.http.get<Paciente[]>(this.url);
  }

  listarPorId(id: number){
    return this.http.get<Paciente>(`${this.url}/${id}`);
  }

  registrar(paciente: Paciente){
    return this.http.post(this.url, paciente);
  }
  modificar(paciente: Paciente){
    return this.http.put(this.url, paciente);
  }
  eliminar(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }
*/
  /*get set*/
  setMensajeCambio(mensaje: string){
      this.mensajeCambio.next(mensaje);
    }
  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setPacienteCambio(lista: Paciente[]){
    this.pacienteCambio.next(lista);
  }
  getPacienteCambio(){
    return this.pacienteCambio.asObservable();
  }


}
