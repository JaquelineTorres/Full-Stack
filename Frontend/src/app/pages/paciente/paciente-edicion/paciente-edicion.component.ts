import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css']
})
export class PacienteEdicionComponent implements OnInit {


  form!: FormGroup;
  id!: number;
  ediccion!: boolean;

  constructor(
    private route: ActivatedRoute,
    //Se crea un rauter para controlar la navegación
    private router: Router,
    private pacienteService: PacienteService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'apellidos': new FormControl(''),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl(''),

    });
    this.route.params.subscribe( (data: Params) => {
      this.id = data ['id'];
      this.ediccion = data['id'] != null
      this.initForm();
    });
  }

  operar(){
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombre = this.form.value['nombre'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion']

    if (this.ediccion){
      //MODIFICAR
      //PRACTICA COMUN
      this.pacienteService.modificar(paciente).subscribe( ()=> {
        this.pacienteService.listar().subscribe(data => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio('SE MODIFICÓ')
        });
      });
    }else{
      //REGISTRAR
      //PARACTICA IDEAL
      this.pacienteService.registrar(paciente).pipe(switchMap( () => {
        return this.pacienteService.listar();
      })).subscribe(data => {
        this.pacienteService.setPacienteCambio(data);
        this.pacienteService.setMensajeCambio('SE REGISTRÓ');
      });
    }

    this.router.navigate(['paciente']);
  }

initForm() {
    if (this.ediccion) {
      this.pacienteService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idPaciente),
          'nombre': new FormControl(data.nombre),
          'apellidos': new FormControl(data.apellidos),
          'dni': new FormControl(data.dni),
          'telefono': new FormControl(data.telefono),
          'direccion': new FormControl(data.direccion),
        });
      });
    }
  }
}
