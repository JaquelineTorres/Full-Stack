import { validateHorizontalPosition } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paciente } from '../../_model/paciente';
import { PacienteService } from '../../_service/paciente.service';
import { Medico } from '../../_model/medico';
import { MedicoService } from '../../_service/medico.service';
import { Especialidad } from '../../_model/especialidad';
import { Examen } from '../../_model/examen';
import { DetalleConsulta } from '../../_model/detalleConsulta';
import { EspecialidadService } from '../../_service/especialidad.service';
import { ExamenService } from '../../_service/examen.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Consulta } from 'src/app/_model/consulta';
import { ConsultaService } from '../../_service/consulta.service';
import { ConsultaListaExamenDTO } from 'src/app/_dto/consultaListaExamenDTO';
import * as moment from 'moment';

@Component({
  selector: 'app-consulta-especial',
  templateUrl: './consulta-especial.component.html',
  styleUrls: ['./consulta-especial.component.css']
})
export class ConsultaEspecialComponent implements OnInit {
  form!: FormGroup;
  pacientes!: Paciente[];
  medicos!: Medico[];
  especialidades!: Especialidad[];
  examenes!: Examen[];

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  diagnostico!: string | null;
  tratamiento!: string | null;
  mensaje!: string;

  pacienteSeleccionado!: Paciente | null;
  medicoSeleccionado!: Medico | null
  especialidadSeleccionada!: Especialidad | null;
  examenSeleccionado!: Examen | null;

  // utiles para autocomplete
  myControlPaciente: FormControl = new FormControl();
  myControlMedico: FormControl = new FormControl();

  pacientesFiltrados$!: Observable<Paciente[]>;
  medicosFiltrados$!: Observable<Medico[]>;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private snackBar: MatSnackBar,
    private consultaService: ConsultaService

  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'paciente': this.myControlPaciente,
      'especialidad': new FormControl(),
      'medico': this.myControlMedico,
      'fecha': new FormControl(new Date()),
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl('')
    });
    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarExamenes();

    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
    this.medicosFiltrados$ = this.myControlMedico.valueChanges.pipe(map(val => this.filtrarMedicos(val)));

  }
  // ********************** PACIENTE **********************
  filtrarPacientes(val: any){
    if(val != null && val.idPaciente > 0){
      return this.pacientes.filter(el =>
        el.nombre.toLowerCase().includes(val.nombre.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase())
        || el.dni.toLowerCase().includes(val.dni.toLowerCase()) );
        // return EMPTY; debe ser de la libreria RxJS
    }
    return this.pacientes.filter(el =>
      // '?' para evitar undefined, significa opcional
      el.nombre.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase())
      || el.dni.toLowerCase().includes(val?.toLowerCase(val)) );
  }
  listarPacientes(){
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }
  //Retorna la concatenación de Nombre y Apellidos
  mostrarPaciente(val: Paciente){
    return val ? `${val.nombre} ${val.apellidos}` : val;
  }
  // ********************** PACIENTE **********************


  // ********************** MEDICO **********************

  filtrarMedicos(val: any) {
    if (val != null && val.idMedico > 0) {
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || option.cmp.includes(val.cmp));
    } else {
      return this.medicos.filter(option =>
        option.nombres.toLowerCase().includes(val?.toLowerCase()) || option.apellidos.toLowerCase().includes(val?.toLowerCase()) || option.cmp.includes(val));
    }
  }

  listarMedicos() {
    this.medicoService.listar().subscribe(data => {
      this.medicos = data;
    });
  }

  mostrarMedico(val: Medico) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  //Retorna la concatenación de Nombre y Apellidos
  mostrarMedicos(val: Medico){
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }
 // ********************** MEDICO **********************



 // ********************** ESPECIALIDAD **********************

 listarEspecialidad(){
   this.especialidadService.listar().subscribe(data =>{
     this.especialidades = data;
   });
 }
 // ********************** ESPECIALIDAD **********************


  // ********************** EXAMEN **********************

  listarExamenes(){
    this.examenService.listar().subscribe(data =>{
      this.examenes = data;
    });
  }
  // ********************** EXAMEN **********************

  seleccionarEsp(e: any){
        //console.log(e.value.idRegion);
    //service.listarProvincias(idRegion);
  }


  aceptar(){
    let consulta = new Consulta();
    consulta.paciente = this.form.value['paciente'];
    consulta.medico = this.form.value['medico'];
    consulta.especialidad = this.form.value['especialidad'];
    consulta.numConsutorio = "C1";
    consulta.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open("Se registró", "Aviso", { duration: 2000 });

      setTimeout(() => {
        this.limpiarControles();
      }, 2000)

    });
  }


  agregar() {

    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;
      this.detalleConsulta.push(det);
      this.diagnostico = null;
      this.tratamiento = null;
    } else {
      this.mensaje = `Debe agregar un diagnóstico y tramiento`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  removerDiagnostico(index: number){
    // splice -> es para eliminar
    // Elimina solo una fila "1"
    this.detalleConsulta.splice(index, 1)

  }

  agregarExamen() {
    if (this.examenSeleccionado) {
      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.examenSeleccionado.idExamen) {
          cont++;
          break;
        }
      }
      if (cont > 0) {
        this.mensaje = `El examen se encuentra en la lista`;
        this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
      } else {
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    } else {
      this.mensaje = `Debe agregar un examen`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  removerExamen(index: number) {
    this.examenesSeleccionados.splice(index, 1);
  }
  estadoBotonRegistrar() {
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionada === null
      || this.medicoSeleccionado === null || this.pacienteSeleccionado === null);
  }
  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    this.pacienteSeleccionado = null;
    this.especialidadSeleccionada = null;
    this.medicoSeleccionado = null;
    this.examenSeleccionado = null;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';
    //para autocompletes
    this.myControlPaciente.reset();
    this.myControlMedico.reset();
  }

}
