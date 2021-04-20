
import { Paciente } from './paciente';
import { Medico } from './medico';
import { Especialidad } from './especialidad';
import { DetalleConsulta } from './detalleConsulta';

export class Consulta{
  idConsulta!: number;
  paciente!: Paciente;
  medico!: Medico;
  especialidad!: Especialidad;
  fecha!: string; //2020-11-07T11:30:05 ISODate || moment.js
  numConsutorio!: string;
  detalleConsulta!: DetalleConsulta[];
}
