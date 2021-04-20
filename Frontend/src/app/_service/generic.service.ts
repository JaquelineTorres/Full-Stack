import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// ************************ ES EL PADRE ************************
@Injectable({
  providedIn: 'root'
})
// <T> significa que recibirá cualquier tipo de CLASE
export class GenericService <T>{

  constructor(
    //EL DEBE TERNER HttpClient
    protected http: HttpClient,
    // Inject -> para inyectar la url
    @Inject(String) protected url: string //  @Inject(String) ES NECESARIO EN AGULAR 9,10
  ) { }

  listar(){
    return this.http.get<T[]>(this.url);
  }
  listarPorId(id: number){
    return this.http.get<T>(`${this.url}/${id}`);
  }
  registrar(t:T){
    return this.http.post(this.url, t);
  }
  modificar(t: T){
    return this.http.put(this.url, t);
  }

  eliminar(id: number){
    return this.http.delete(`${this.url}/${id}}`);
  }
}
