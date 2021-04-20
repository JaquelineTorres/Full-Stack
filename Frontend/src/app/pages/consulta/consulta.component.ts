import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../_service/paciente.service';
import { Paciente } from '../../_model/paciente';
import { Observable } from 'rxjs';
import { Especialidad } from '../../_model/especialidad';
import { Medico } from '../../_model/medico';
import { Examen } from '../../_model/examen';
import { MedicoService } from '../../_service/medico.service';
import { EspecialidadService } from '../../_service/especialidad.service';
import { ExamenService } from '../../_service/examen.service';
import { Data } from '@angular/router';
import { DetalleConsulta } from '../../_model/detalleConsulta';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Consulta } from '../../_model/consulta';
import * as moment from 'moment';
import { ConsultaService } from '../../_service/consulta.service';
import { ConsultaListaExamenDTO } from 'src/app/_dto/consultaListaExamenDTO';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  pacientes!: Paciente[];
  pacientes$!: Observable<Paciente[]>;
  medicos$!: Observable<Medico[]>;
  especialidades$!: Observable<Especialidad[]>;
  examenes$!: Observable<Examen[]>;

  idPacienteSeleccionado!: number;
  idMedicoSeleccionado!: number;
  idEspecialidadSeleccionado!: number;
  idExamenSeleccionado!: number;

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  diagnostico!: string | null;
  tratamiento!: string | null;

  detalleConsulta: DetalleConsulta [] = [];

  examenesSeleccionados: Examen[]=[];


  constructor(
    //Inyeccion
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private snackBar: MatSnackBar,
    private consultaService: ConsultaService
  ) { }

  ngOnInit(): void {
    //Esto es asincrono, cualquiera puede terminar primero
    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidades();
    this.listarExamenes();
  }
  listarPacientes(){
    //POBLAR VIEJITA
    //this.pacienteService.listar().subscribe(data => this.pacientes = data);
    this.pacientes$ = this.pacienteService.listar();
  }

  listarMedicos(){
    this.medicos$ = this.medicoService.listar();

  }

  listarEspecialidades(){
    this.especialidades$ = this.especialidadService.listar();
  }

  listarExamenes(){
    this.examenes$ = this.examenService.listar();
  }

  agregar(){
    if(this.diagnostico != null && this.tratamiento != null){
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;

      this.detalleConsulta.push(det);

      this.diagnostico = null;
      this.tratamiento = null;
    }
  }

  removerDiagnostico(index: number){
    // splice -> es para eliminar
    // Elimina solo una fila "1"
    this.detalleConsulta.splice(index, 1)

  }

  agregarExamen() {
    if (this.idExamenSeleccionado > 0) {

      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.idExamenSeleccionado) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        let mensaje = 'El examen se encuentra en la lista';
        this.snackBar.open(mensaje, "Aviso", { duration: 2000 });
      } else {
        this.examenService.listarPorId(this.idExamenSeleccionado).subscribe(data => {
          this.examenesSeleccionados.push(data);
        });

      }
    }
  }

  removerExamen(index: number){
    this.examenesSeleccionados.splice(index,1);
    let mensaje = 'El examen fué eliminado';
    this.snackBar.open(mensaje, "Aviso", {duration: 3000 });
  }
//COMBO BOX
  aceptar(){
    // construyendo instancias
    let medico = new Medico();
    medico.idMedico = this.idMedicoSeleccionado;

    let especialidad = new Especialidad();
    especialidad.idEspecialidad = this.idEspecialidadSeleccionado;

    let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;

    let consulta = new Consulta();

    //Contruyendo el Json de Consulta del Psman
    consulta.especialidad = especialidad;
    consulta.medico = medico;
    consulta.paciente = paciente;
    consulta.numConsutorio = "C1";

    //Para el formato ISODate
    // si vas a utilizar fechas especificas no se recomienda utilizar librerias
    /*let tzoffset = (new Date()).getTimezoneOffset()*60000;
    let localISOTime = (new Date (this.fechaSeleccionada.getTime()-tzoffset)).toISOString();
    console.log(localISOTime);
    */
   // Más Facil para la fecha
    consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');

    consulta.detalleConsulta = this.detalleConsulta;

    //Para obtener la lista de exemenes
    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados

    console.log(consultaListaExamenDTO);

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(()=>{
      this.snackBar.open("Se registró", "Aviso", {duration: 2000 });

      //Despues de un tiempo muerto limpiar controles

      setTimeout(()=>{
        this.limpiarControles();
      }, 2000)
    });
  }
  // valida si se ha seleccionado los campos

  estadoBotonRegistrar(){
    return (this.detalleConsulta.length === 0 || this.idEspecialidadSeleccionado === 0 || this.idMedicoSeleccionado === 0 ||
    this.idPacienteSeleccionado === 0);
  }

  limpiarControles(){
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = null;
    this.tratamiento = null;
    this.idPacienteSeleccionado = 0;
    this. idEspecialidadSeleccionado = 0;
    this.idMedicoSeleccionado = 0;
    this.idExamenSeleccionado = 0;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
  }

}
