import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FiltroConsultaDTO } from '../../_dto/FiltroConsultaDTO';
import * as moment from 'moment';
import { ConsultaService } from '../../_service/consulta.service';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css']
})
export class BuscarComponent implements OnInit {


  form!: FormGroup;
  maxFecha: Date = new Date();


  constructor(
    private consultaService: ConsultaService
  ) { }

  ngOnInit(): void {
    //INICIALIZACION DE FROMGRUPS
    this.form = new FormGroup({
      'dni': new FormControl(''),
      'nombreCompleto': new FormControl(''),
      'fechaConsulta': new FormControl()
    });
  }

  buscar() {
    let fecha = this.form.value['fechaConsulta'];
    fecha = fecha != null ? moment(fecha).format('YYYY-MM-DDTHH:mm:ss') : '';

    let filtro = new FiltroConsultaDTO(this.form.value['dni'], this.form.value['nombreCompleto']);

    /*
     {
       dni : ''
       nombreCompleto: xxxxx
     }
     */



    if (filtro.dni.length === 0) {

      //delete filtro.dni;
    }

    if (filtro.nombreCompleto.length === 0) {
      // delete filtro.nombreCompleto;
    }

    if (fecha != null && fecha !== "") {
      this.consultaService.buscarFecha(fecha).subscribe(data => console.log(data));
    } else {
      //console.log(filtro);
      this.consultaService.buscarOtros(filtro).subscribe(data => console.log(data));
    }
  }

}
