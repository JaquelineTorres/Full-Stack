import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConsultaListaExamenDTO } from '../_dto/consultaListaExamenDTO';
import { environment } from '../../environments/environment';
import { Consulta } from '../_model/consulta';
import { FiltroConsultaDTO } from '../_dto/FiltroConsultaDTO';
/*interface dto{
}*/
@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private url: string = `${environment.HOST}/consultas`

  constructor(
    private http: HttpClient
  ) { }

  registrarTransaccion(consultaDTO: ConsultaListaExamenDTO){
    return this.http.post(this.url, consultaDTO);

  }
  buscarOtros(filtroConsulta: FiltroConsultaDTO){
    return this.http.post<Consulta[]>(`${this.url}/buscar/otros`, filtroConsulta);
  }

  buscarFecha(fecha: string){
    //RequestPARAM se le manda ?
    return this.http.get<Consulta[]>(`${this.url}/buscar?fecha=${fecha}`);
  }

}
