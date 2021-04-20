import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { ConsultaListaExamenDTO } from 'src/app/_dto/consultaListaExamenDTO';
import { Consulta } from 'src/app/_model/consulta';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { Medico } from 'src/app/_model/medico';
import { Paciente } from 'src/app/_model/paciente';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { MedicoService } from 'src/app/_service/medico.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Especialidad } from '../../_model/especialidad';
import { Examen } from '../../_model/examen';
import { ConsultaService } from '../../_service/consulta.service';
import * as moment from 'moment';


@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  //Para llamar a los # de html
  @ViewChild('stepper') stepper!: MatStepper;

  isLinear: boolean = false;
  primerFormGroup!: FormGroup;
  segundoFormGroup!: FormGroup;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  //Declarar listas
  pacientes: Paciente[] = [];
  especialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  examenes: Examen [] =[];
  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen [] = [];

  pacienteSeleccionado!: Paciente;
  medicoSeleccionado!: Medico;
  especialidadSeleccionada!: Especialidad;
  examenSeleccionado!: Examen;

  diagnostico!: string | null;
  tratamiento!: string | null;
  mensaje!: string;

  consultorios: number [] = [];
  consultorioSeleccionado: number = 0;



  constructor(
    // En el constructor se pone la inyección de DEPENDENCIA "En angular"
    //Para agrupar formularios se hace los siguinete
    private formBuilder: FormBuilder,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private snackBar: MatSnackBar,
    private consultaService: ConsultaService,
  ) { }

  ngOnInit(): void {
    //Para agrupar formularios se hace los siguinete
    // Estos formularios se utilizan en htmñ
        //PERIMER FORMULARIO
    this.primerFormGroup = this.formBuilder.group({
      cboPaciente: ['', Validators.required],
      fecha:['', new FormControl(new Date(), [Validators.required])],
      'diagnostico': new FormControl(''),
      'tratamiento': new FormControl(''),
    });
    //SEGUNDO FORMULARIO
    this.segundoFormGroup = this.formBuilder.group({
      hidden:['', Validators.required]
    });
    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarExamenes();
    this.listarConsultorios();
  }

  listarPacientes(){
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  listarMedicos() {
    this.medicoService.listar().subscribe(data => {
      this.medicos = data;
    });
  }
  listarEspecialidad(){
    this.especialidadService.listar().subscribe(data =>{
      this.especialidades = data;
    });
  }

  listarExamenes(){
    this.examenService.listar().subscribe(data =>{
      this.examenes = data;
    });
  }
  listarConsultorios(){
    for (let i = 1; i <= 20; i++){
      this.consultorios.push(i);

    }
  }

  seleccionarPaciente(e: any){
    this.pacienteSeleccionado = e.value;
  }

  seleccionarEspecialidad(e: any){
    this.especialidadSeleccionada = e.value;
  }

  seleccionarMedico(medico: Medico){
    this.medicoSeleccionado = medico;
  }

  sleccionarConsultorio(c: number){
    this.consultorioSeleccionado = c;

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
      this.mensaje = `Debe agregar un diagnóstico y tratamiento`;
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });
    }
  }

  removerDiagnostico(index: number){
    this.detalleConsulta.splice(index,1);

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
        //Como examen es un objeto se puede hacer con PUSH
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

  nextManualStep(){
    if (this.consultorioSeleccionado>0){
      this.stepper.linear = false;
      this.stepper.next();

    }else{
      this.snackBar.open('DEBES SELECCIONAR CONSULTORIO', 'INFO', {duration: 2000});
    }
  }

  registrar() {
    let consulta = new Consulta();
    consulta.especialidad = this.especialidadSeleccionada;
    consulta.medico = this.medicoSeleccionado;
    consulta.paciente = this.pacienteSeleccionado;
    consulta.fecha = moment(this.fechaSeleccionada).format('YYYY-MM-DDTHH:mm:ss');
    consulta.detalleConsulta = this.detalleConsulta;
    consulta.numConsutorio = `C${this.consultorioSeleccionado}`;

    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open("Se registró", "Aviso", { duration: 2000 });

      setTimeout(() => {
        this.limpiarControles();
      }, 2000);
    });
  }
  //TE MUESTRA EN EL ULTIMO PASO TODO LO QUE SELECCIONASTE
  estadoBotonRegistrar() {
    return (this.detalleConsulta.length === 0 || this.especialidadSeleccionada === undefined || this.medicoSeleccionado === undefined
      || this.pacienteSeleccionado === undefined || this.consultorioSeleccionado === 0);
  }


  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.diagnostico = '';
    this.tratamiento = '';
    //this.pacienteSeleccionado = undefined;
    //this.especialidadSeleccionada = undefined;
    //this.medicoSeleccionado = undefined;
    //this.examenSeleccionado = undefined;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.consultorioSeleccionado = 0;
    this.mensaje = '';
    //PARA REGRESAR EN AL PASO 1
    this.stepper.reset();
  }
}
